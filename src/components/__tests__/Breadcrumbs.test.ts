import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Breadcrumbs from '@/components/Breadcrumbs.vue'
import type { BreadcrumbItems } from '@/types'

const RouterLinkStub = {
  props: ['to'],
  template: '<a :href="typeof to === \'string\' ? to : JSON.stringify(to)"><slot /></a>',
}

const IconStub = {
  props: ['name'],
  template: '<i class="icon-stub" :data-name="name" />',
}

const breadcrumbs: BreadcrumbItems = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products' },
  { label: 'Electronics', link: '/products/electronics' },
]

function mountBreadcrumbs(props: Record<string, unknown> = {}) {
  return mount(Breadcrumbs, {
    props: { breadcrumbs, ...props },
    global: { stubs: { RouterLink: RouterLinkStub, Icon: IconStub } },
  })
}

describe('Breadcrumbs', () => {
  it('renders a link per breadcrumb with its label', () => {
    const wrapper = mountBreadcrumbs()

    const links = wrapper.findAll('a')

    expect(links).toHaveLength(3)
    expect(links.map((link) => link.text())).toEqual(['Home', 'Products', 'Electronics'])
  })

  it('passes each breadcrumb link to the router link', () => {
    const wrapper = mountBreadcrumbs()

    expect(wrapper.findAll('a').map((link) => link.attributes('href'))).toEqual([
      '/',
      '/products',
      '/products/electronics',
    ])
  })

  it('supports named route locations as links', () => {
    const wrapper = mountBreadcrumbs({
      breadcrumbs: [{ label: 'John Doe', link: { name: 'user', params: { id: 123 } } }],
    })

    expect(wrapper.find('a').attributes('href')).toBe(JSON.stringify({ name: 'user', params: { id: 123 } }))
  })

  it('marks only the last breadcrumb as the current page', () => {
    const wrapper = mountBreadcrumbs()

    expect(wrapper.findAll('a').map((link) => link.attributes('aria-current'))).toEqual([undefined, undefined, 'page'])
  })

  it('renders a separator between breadcrumbs but not after the last one', () => {
    const wrapper = mountBreadcrumbs()

    const separators = wrapper.findAll('.icon-stub')

    expect(separators).toHaveLength(2)
    expect(separators[0]!.attributes('data-name')).toBe('chevron-right')
  })

  it('exposes itself as a labelled breadcrumb navigation landmark', () => {
    const wrapper = mountBreadcrumbs()

    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('Breadcrumb')
  })

  it('renders no links for an empty list', () => {
    const wrapper = mountBreadcrumbs({ breadcrumbs: [] })

    expect(wrapper.findAll('a')).toHaveLength(0)
    expect(wrapper.findAll('.icon-stub')).toHaveLength(0)
  })

  it('renders a single breadcrumb without a separator', () => {
    const wrapper = mountBreadcrumbs({
      breadcrumbs: [{ label: 'Home', link: '/' }],
    })

    expect(wrapper.findAll('a')).toHaveLength(1)
    expect(wrapper.findAll('.icon-stub')).toHaveLength(0)
    expect(wrapper.find('a').attributes('aria-current')).toBe('page')
  })
})
