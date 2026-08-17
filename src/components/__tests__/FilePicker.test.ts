import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { dragEvent } from '@/__tests__/helpers/dragEvents'
import FilePicker from '@/components/FilePicker.vue'

function createFile(name: string, type: string): File {
  return new File(['content'], name, { type })
}

type DragPayload = { files?: File[]; html?: string }

/** The payload is assembled by the shared `dragEvent` helper; this only names it at the call site. */
const createDataTransfer = (payload: DragPayload = {}): DragPayload => payload

function dispatchDragEvent(element: Element, type: string, payload: DragPayload): Event {
  const event = dragEvent(type, payload)
  element.dispatchEvent(event)

  return event
}

/** The composable writes the drop effect onto the event's dataTransfer. */
const dropEffectOf = (event: Event): string => (event as any).dataTransfer.dropEffect

function selectFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: files, configurable: true })
  input.dispatchEvent(new Event('change'))
}

describe('FilePicker', () => {
  it('renders a button with the label and a hidden file input', () => {
    const wrapper = mount(FilePicker, { props: { label: 'Upload Images' } })

    const input = wrapper.find('input[type="file"]')

    expect(wrapper.find('button.FilePicker').text()).toBe('Upload Images')
    expect(input.exists()).toBe(true)
    expect(input.attributes('hidden')).toBeDefined()
  })

  it('renders the default slot instead of the built-in button', () => {
    const wrapper = mount(FilePicker, {
      props: { label: 'Upload' },
      slots: { default: '<div class="dropzone">Drop files here</div>' },
    })

    expect(wrapper.find('button.FilePicker .dropzone').text()).toBe('Drop files here')
    expect(wrapper.find('.vuiii-button').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Upload')
  })

  it('opens the native file dialog when the trigger is clicked', async () => {
    const wrapper = mount(FilePicker)
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    const click = vi.spyOn(input, 'click').mockImplementation(() => {})

    await wrapper.find('button.FilePicker').trigger('click')

    expect(click).toHaveBeenCalledTimes(1)
  })

  it('emits files with the file selected through the native input', () => {
    const wrapper = mount(FilePicker)
    const file = createFile('report.pdf', 'application/pdf')

    selectFiles(wrapper.find('input[type="file"]').element as HTMLInputElement, [file])

    expect(wrapper.emitted('files')).toHaveLength(1)
    expect(wrapper.emitted('files')![0]).toEqual([[file]])
  })

  it('emits every file when several are selected through the native input', () => {
    const wrapper = mount(FilePicker, { props: { multiple: true } })
    const files = [createFile('a.png', 'image/png'), createFile('b.png', 'image/png')]

    selectFiles(wrapper.find('input[type="file"]').element as HTMLInputElement, files)

    expect(wrapper.emitted('files')![0][0]).toEqual(files)
  })

  it('clears the native input after a selection so the same file can be picked again', () => {
    const wrapper = mount(FilePicker)
    const input = wrapper.find('input[type="file"]').element as HTMLInputElement
    const file = createFile('report.pdf', 'application/pdf')

    selectFiles(input, [file])

    expect(input.value).toBe('')

    // picking the very same file again still reaches the consumer
    selectFiles(input, [file])

    expect(wrapper.emitted('files')).toHaveLength(2)
    expect(wrapper.emitted('files')![1]).toEqual([[file]])
  })

  it('emits an empty list when the native input reports no selection', () => {
    const wrapper = mount(FilePicker)

    selectFiles(wrapper.find('input[type="file"]').element as HTMLInputElement, [])

    expect(wrapper.emitted('files')![0]).toEqual([[]])
  })

  it('does not allow multiple files on the native input by default', () => {
    const wrapper = mount(FilePicker)

    expect(wrapper.find('input[type="file"]').attributes('multiple')).toBeUndefined()
  })

  it('allows multiple files on the native input when multiple is set', () => {
    const wrapper = mount(FilePicker, { props: { multiple: true } })

    expect(wrapper.find('input[type="file"]').attributes('multiple')).toBeDefined()
  })

  it('passes a string accept straight through to the native input', () => {
    const wrapper = mount(FilePicker, { props: { accept: 'image/*' } })

    expect(wrapper.find('input[type="file"]').attributes('accept')).toBe('image/*')
  })

  it('joins an array accept into a comma separated list for the native input', () => {
    const wrapper = mount(FilePicker, { props: { accept: ['image/png', 'image/jpeg', '.pdf'] } })

    expect(wrapper.find('input[type="file"]').attributes('accept')).toBe('image/png,image/jpeg,.pdf')
  })

  it('leaves accept off the native input when no accept is given', () => {
    const wrapper = mount(FilePicker)

    expect(wrapper.find('input[type="file"]').attributes('accept')).toBeUndefined()
  })

  it('emits files dropped onto the trigger', async () => {
    const wrapper = mount(FilePicker)
    const file = createFile('photo.png', 'image/png')

    dispatchDragEvent(wrapper.find('button.FilePicker').element, 'drop', createDataTransfer({ files: [file] }))
    await flushPromises()

    expect(wrapper.emitted('files')).toHaveLength(1)
    expect(wrapper.emitted('files')![0]).toEqual([[file]])
  })

  it('keeps only the first dropped file when multiple is not set', async () => {
    const wrapper = mount(FilePicker)
    const first = createFile('a.png', 'image/png')
    const second = createFile('b.png', 'image/png')

    dispatchDragEvent(wrapper.find('button.FilePicker').element, 'drop', createDataTransfer({ files: [first, second] }))
    await flushPromises()

    expect(wrapper.emitted('files')![0][0]).toEqual([first])
  })

  it('emits every dropped file when multiple is set', async () => {
    const wrapper = mount(FilePicker, { props: { multiple: true } })
    const files = [createFile('a.png', 'image/png'), createFile('b.png', 'image/png')]

    dispatchDragEvent(wrapper.find('button.FilePicker').element, 'drop', createDataTransfer({ files }))
    await flushPromises()

    expect(wrapper.emitted('files')![0][0]).toEqual(files)
  })

  it('drops files whose type is not covered by an array accept', async () => {
    const wrapper = mount(FilePicker, { props: { accept: ['image/png'], multiple: true } })
    const png = createFile('photo.png', 'image/png')
    const pdf = createFile('report.pdf', 'application/pdf')

    dispatchDragEvent(wrapper.find('button.FilePicker').element, 'drop', createDataTransfer({ files: [png, pdf] }))
    await flushPromises()

    expect(wrapper.emitted('files')![0][0]).toEqual([png])
  })

  it('drops files whose type is not covered by a comma separated string accept', async () => {
    const wrapper = mount(FilePicker, { props: { accept: 'image/png, image/jpeg', multiple: true } })
    const jpeg = createFile('photo.jpg', 'image/jpeg')
    const pdf = createFile('report.pdf', 'application/pdf')

    dispatchDragEvent(wrapper.find('button.FilePicker').element, 'drop', createDataTransfer({ files: [jpeg, pdf] }))
    await flushPromises()

    expect(wrapper.emitted('files')![0][0]).toEqual([jpeg])
  })

  it('emits nothing when every dropped file is rejected by accept', async () => {
    const wrapper = mount(FilePicker, { props: { accept: ['image/png'] } })
    const pdf = createFile('report.pdf', 'application/pdf')

    dispatchDragEvent(wrapper.find('button.FilePicker').element, 'drop', createDataTransfer({ files: [pdf] }))
    await flushPromises()

    expect(wrapper.emitted('files')).toBeUndefined()
  })

  it('accepts any file of the family when accept uses a wildcard', async () => {
    const wrapper = mount(FilePicker, { props: { accept: 'image/*' } })
    const png = createFile('photo.png', 'image/png')

    dispatchDragEvent(wrapper.find('button.FilePicker').element, 'drop', createDataTransfer({ files: [png] }))
    await flushPromises()

    expect(wrapper.emitted('files')![0][0]).toEqual([png])
  })

  it('ignores a drop that carries no items', async () => {
    const wrapper = mount(FilePicker)

    dispatchDragEvent(wrapper.find('button.FilePicker').element, 'drop', createDataTransfer())
    await flushPromises()

    expect(wrapper.emitted('files')).toBeUndefined()
  })

  it('accepts the drag by preventing the default dragover and marking the effect as a copy', () => {
    const wrapper = mount(FilePicker)
    const dataTransfer = createDataTransfer({ files: [createFile('photo.png', 'image/png')] })

    const event = dispatchDragEvent(wrapper.find('button.FilePicker').element, 'dragover', dataTransfer)

    expect(event.defaultPrevented).toBe(true)
    expect(dropEffectOf(event)).toBe('copy')
  })

  it('leaves a dragover carrying no files to the browser', () => {
    const wrapper = mount(FilePicker)
    const dataTransfer = createDataTransfer()

    const event = dispatchDragEvent(wrapper.find('button.FilePicker').element, 'dragover', dataTransfer)

    expect(event.defaultPrevented).toBe(false)
    expect(dropEffectOf(event)).toBe('none')
  })

  it('resets the drop effect when the drag leaves the trigger', () => {
    const wrapper = mount(FilePicker)
    const trigger = wrapper.find('button.FilePicker').element
    const dataTransfer = createDataTransfer({ files: [createFile('photo.png', 'image/png')] })

    expect(dropEffectOf(dispatchDragEvent(trigger, 'dragenter', dataTransfer))).toBe('copy')

    expect(dropEffectOf(dispatchDragEvent(trigger, 'dragleave', dataTransfer))).toBe('none')
  })

  it('stops reacting to drops once the picker is unmounted', async () => {
    const wrapper = mount(FilePicker)
    const trigger = wrapper.find('button.FilePicker').element

    wrapper.unmount()
    dispatchDragEvent(trigger, 'drop', createDataTransfer({ files: [createFile('photo.png', 'image/png')] }))
    await flushPromises()

    expect(wrapper.emitted('files')).toBeUndefined()
  })

  it('emits a file fetched from an image dragged in as HTML', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ blob: async () => new Blob(['binary'], { type: 'image/png' }) }))
    const wrapper = mount(FilePicker)

    dispatchDragEvent(
      wrapper.find('button.FilePicker').element,
      'drop',
      createDataTransfer({ html: '<img src="https://example.com/photo.png">' }),
    )
    await flushPromises()

    const emitted = wrapper.emitted('files')![0][0] as File[]

    expect(emitted).toHaveLength(1)
    expect(emitted[0].name).toBe('photo.png')
    vi.unstubAllGlobals()
  })
})
