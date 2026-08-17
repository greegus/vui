import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'

import { FILE_ITEM, HTML_ITEM, PLAIN_TEXT_ITEM, dragEvent } from '@/__tests__/helpers/dragEvents'
import { useDropArea } from '@/composables/useDropArea'

type DropAreaOptions = Parameters<typeof useDropArea>[2]

const fileItem = FILE_ITEM
const htmlItem = HTML_ITEM
const plainTextItem = PLAIN_TEXT_ITEM

function mountDropArea(onFiles: (files: File[]) => void, options: DropAreaOptions = {}) {
  const Host = defineComponent({
    setup() {
      const dropArea = ref<HTMLElement>()

      const { isDropzoneActive } = useDropArea(dropArea, onFiles, options)

      return { dropArea, isDropzoneActive }
    },
    template: '<div ref="dropArea" :class="{ active: isDropzoneActive }">Drop here</div>',
  })

  return mount(Host, { attachTo: document.body })
}

const pngFile = new File(['png'], 'picture.png', { type: 'image/png' })
const pdfFile = new File(['pdf'], 'document.pdf', { type: 'application/pdf' })

describe('useDropArea', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('activates the dropzone while files are dragged over the element', async () => {
    const wrapper = mountDropArea(vi.fn())

    wrapper.element.dispatchEvent(dragEvent('dragover', { items: [fileItem] }))
    vi.advanceTimersByTime(5)
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('active')
  })

  it('deactivates the dropzone when the drag leaves the element', async () => {
    const wrapper = mountDropArea(vi.fn())

    wrapper.element.dispatchEvent(dragEvent('dragover', { items: [fileItem] }))
    vi.advanceTimersByTime(5)
    wrapper.element.dispatchEvent(dragEvent('dragleave', { items: [fileItem] }))
    vi.advanceTimersByTime(5)
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).not.toContain('active')
  })

  it('accepts a drag carrying html instead of files', async () => {
    const wrapper = mountDropArea(vi.fn())

    wrapper.element.dispatchEvent(dragEvent('dragover', { items: [htmlItem] }))
    vi.advanceTimersByTime(5)
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).toContain('active')
  })

  it('ignores a drag that carries neither files nor html', async () => {
    const wrapper = mountDropArea(vi.fn())

    const event = dragEvent('dragover', { items: [plainTextItem] })
    wrapper.element.dispatchEvent(event)
    vi.advanceTimersByTime(5)
    await wrapper.vm.$nextTick()

    expect(event.defaultPrevented).toBe(false)
    expect(wrapper.classes()).not.toContain('active')
  })

  it('prevents the default browser handling of a valid dragover', () => {
    const wrapper = mountDropArea(vi.fn())

    const event = dragEvent('dragover', { items: [fileItem] })
    wrapper.element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
  })

  it('hands the dropped file over to the callback', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles)

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pngFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).toHaveBeenCalledWith([pngFile])
  })

  it('hands over only the first file when multiple is not set', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles)

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pngFile, pdfFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).toHaveBeenCalledWith([pngFile])
  })

  it('hands over every dropped file when multiple is set', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles, { multiple: true })

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pngFile, pdfFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).toHaveBeenCalledWith([pngFile, pdfFile])
  })

  it('drops files whose type is not accepted', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles, { accept: 'image/png', multiple: true })

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pngFile, pdfFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).toHaveBeenCalledWith([pngFile])
  })

  it('accepts a comma separated list of types', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles, { accept: 'image/png, application/pdf', multiple: true })

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pngFile, pdfFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).toHaveBeenCalledWith([pngFile, pdfFile])
  })

  it('accepts an array of types', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles, { accept: ['application/pdf'], multiple: true })

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pngFile, pdfFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).toHaveBeenCalledWith([pdfFile])
  })

  it('does not call the callback when every dropped file is rejected', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles, { accept: 'image/png' })

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pdfFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).not.toHaveBeenCalled()
  })

  it('deactivates the dropzone after a drop', async () => {
    const wrapper = mountDropArea(vi.fn())

    wrapper.element.dispatchEvent(dragEvent('dragover', { items: [fileItem] }))
    vi.advanceTimersByTime(5)
    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pngFile] }))
    await vi.runAllTimersAsync()
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).not.toContain('active')
  })

  it('reports an unreadable data transfer to onError', async () => {
    const onError = vi.fn()
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles, { onError })

    const event = dragEvent('drop', { items: [fileItem] })
    Object.assign((event as any).dataTransfer, { files: undefined })
    wrapper.element.dispatchEvent(event)
    await vi.runAllTimersAsync()

    expect(onError).toHaveBeenCalledOnce()
    expect(onFiles).not.toHaveBeenCalled()
  })

  it('stops reacting to drag events after the component is unmounted', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles)
    const element = wrapper.element

    wrapper.unmount()
    element.dispatchEvent(dragEvent('drop', { files: [pngFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).not.toHaveBeenCalled()
  })

  it('accepts the drag on dragenter by preventing the default and asking for a copy', () => {
    const wrapper = mountDropArea(vi.fn())

    const event = dragEvent('dragenter', { items: [fileItem] })
    wrapper.element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(true)
    expect((event as any).dataTransfer.dropEffect).toBe('copy')
  })

  it('leaves a dragenter carrying nothing droppable to the browser', () => {
    const wrapper = mountDropArea(vi.fn())

    const event = dragEvent('dragenter', { items: [plainTextItem] })
    wrapper.element.dispatchEvent(event)

    expect(event.defaultPrevented).toBe(false)
    expect((event as any).dataTransfer.dropEffect).toBe('none')
  })

  it('accepts a wildcard type', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles, { accept: 'image/*' })

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pngFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).toHaveBeenCalledWith([pngFile])
  })

  it('accepts a file matched by its extension', async () => {
    const onFiles = vi.fn()
    const wrapper = mountDropArea(onFiles, { accept: ['.pdf'] })

    wrapper.element.dispatchEvent(dragEvent('drop', { files: [pdfFile] }))
    await vi.runAllTimersAsync()

    expect(onFiles).toHaveBeenCalledWith([pdfFile])
  })
})
