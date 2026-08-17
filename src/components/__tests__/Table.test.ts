import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RouterLinkStub } from '@/__tests__/helpers/stubs'
import Table from '@/components/Table.vue'

type User = { id: number; name: string; age: number }

const users: User[] = [
  { id: 1, name: 'Charlie', age: 30 },
  { id: 2, name: 'Alice', age: 41 },
  { id: 3, name: 'Bob', age: 25 },
]

const columns = [
  { name: 'name', label: 'Name' },
  { name: 'age', label: 'Age' },
]

const sortableColumns = [
  { name: 'name', label: 'Name', sortable: true },
  { name: 'age', label: 'Age', sortable: true },
]

function mountTable(props: Record<string, unknown> = {}, options: Record<string, any> = {}) {
  return mount(Table, {
    props: { items: users, columns, ...props },
    global: { stubs: { RouterLink: RouterLinkStub } },
    ...options,
  })
}

function bodyRowTexts(wrapper: ReturnType<typeof mountTable>) {
  return wrapper.findAll('tbody tr').map((row) => row.findAll('td').map((cell) => cell.text()))
}

describe('Table', () => {
  describe('without vue-router registered', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('resolves no router-link when no column defines an href', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(Table, { props: { items: users, columns } })

      expect(warn).not.toHaveBeenCalled()
    })
  })

  it('renders a row per item and a cell per column', () => {
    const wrapper = mountTable()

    const rows = wrapper.findAll('tbody tr')

    expect(rows).toHaveLength(3)
    expect(rows.every((row) => row.findAll('td').length === 2)).toBe(true)
    expect(bodyRowTexts(wrapper)).toEqual([
      ['Charlie', '30'],
      ['Alice', '41'],
      ['Bob', '25'],
    ])
  })

  it('renders the column labels in the header', () => {
    const wrapper = mountTable()

    const headers = wrapper.findAll('thead th')

    expect(headers).toHaveLength(2)
    expect(headers.map((th) => th.text())).toEqual(['Name', 'Age'])
  })

  it('renders no header at all when no column has a label', () => {
    const wrapper = mountTable({
      columns: [{ name: 'name' }, { name: 'age' }],
    })

    expect(wrapper.find('thead').exists()).toBe(false)
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('renders an empty body when items is an empty array', () => {
    const wrapper = mountTable({ items: [] })

    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
  })

  it('renders the noDataMessage row when there are no items', () => {
    const wrapper = mountTable({ items: [], noDataMessage: 'Nothing here' })

    const rows = wrapper.findAll('tbody tr')

    expect(rows).toHaveLength(1)
    expect(rows[0]!.text()).toBe('Nothing here')
  })

  it('does not render the noDataMessage row when there are items', () => {
    const wrapper = mountTable({ noDataMessage: 'Nothing here' })

    expect(wrapper.text()).not.toContain('Nothing here')
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  describe('cell values', () => {
    it('reads the cell value from the item property named after the column', () => {
      const wrapper = mountTable({
        items: [{ id: 1, name: 'Alice', age: 41 }],
      })

      expect(bodyRowTexts(wrapper)).toEqual([['Alice', '41']])
    })

    it('uses the column value function to extract the cell value', () => {
      const wrapper = mountTable({
        items: [{ firstName: 'Ada', lastName: 'Lovelace' }],
        columns: [
          {
            name: 'fullName',
            label: 'Name',
            value: (item: any) => `${item.firstName} ${item.lastName}`,
          },
        ],
      })

      expect(wrapper.find('tbody td').text()).toBe('Ada Lovelace')
    })

    it('passes the row index to the column value function', () => {
      const wrapper = mountTable({
        columns: [
          {
            name: 'position',
            label: '#',
            value: (_item: User, index: number) => index + 1,
          },
        ],
      })

      expect(bodyRowTexts(wrapper)).toEqual([['1'], ['2'], ['3']])
    })

    it('renders the formatted value produced by the column formatter', () => {
      const wrapper = mountTable({
        columns: [
          {
            name: 'age',
            label: 'Age',
            formatter: (value: number) => `${value} years`,
          },
        ],
      })

      expect(bodyRowTexts(wrapper)).toEqual([['30 years'], ['41 years'], ['25 years']])
    })

    it('applies the formatter on top of the value extractor', () => {
      const wrapper = mountTable({
        items: [{ id: 1, name: 'Alice', age: 41 }],
        columns: [
          {
            name: 'label',
            label: 'Label',
            value: (item: User) => item.name.toUpperCase(),
            formatter: (value: string) => `<${value}>`,
          },
        ],
      })

      expect(wrapper.find('tbody td').text()).toBe('<ALICE>')
    })

    it('renders a link when the column defines an href', () => {
      const wrapper = mountTable({
        items: [{ id: 7, name: 'Alice', age: 41 }],
        columns: [
          {
            name: 'name',
            label: 'Name',
            href: (item: User) => `/users/${item.id}`,
            target: '_blank',
          },
        ],
      })

      const link = wrapper.find('tbody td a')

      expect(link.exists()).toBe(true)
      expect(link.text()).toBe('Alice')
      expect(link.attributes('href')).toBe('/users/7')
      expect(link.attributes('target')).toBe('_blank')
    })

    it('passes a named route location produced by href straight to the router link', () => {
      const wrapper = mountTable({
        items: [{ id: 7, name: 'Alice', age: 41 }],
        columns: [
          {
            name: 'name',
            label: 'Name',
            href: (item: User) => ({ name: 'user', params: { id: item.id } }),
          },
        ],
      })

      expect(wrapper.find('tbody td a').attributes('href')).toBe(JSON.stringify({ name: 'user', params: { id: 7 } }))
    })

    it('renders the formatted value inside the link rather than the raw one', () => {
      const wrapper = mountTable({
        items: [{ id: 7, name: 'Alice', age: 41 }],
        columns: [
          {
            name: 'name',
            label: 'Name',
            href: (item: User) => `/users/${item.id}`,
            formatter: (value: string) => value.toUpperCase(),
          },
        ],
      })

      expect(wrapper.find('tbody td a').text()).toBe('ALICE')
    })

    it('applies a cellClass computed from the cell item and value', () => {
      const wrapper = mountTable({
        columns: [
          {
            name: 'age',
            label: 'Age',
            cellClass: ({ value }: { value: number }) => (value > 30 ? 'is-old' : 'is-young'),
          },
        ],
      })

      expect(wrapper.findAll('tbody td').map((td) => td.classes().includes('is-old'))).toEqual([false, true, false])
    })
  })

  describe('slots', () => {
    it('overrides the default cell content with a column:{name} slot', () => {
      const wrapper = mountTable(
        {},
        {
          slots: {
            'column:name': '<strong class="custom">{{ params.value }}</strong>',
          },
        },
      )

      const firstCell = wrapper.findAll('tbody tr')[0]!.findAll('td')[0]!

      expect(firstCell.find('strong.custom').exists()).toBe(true)
      expect(firstCell.text()).toBe('Charlie')
    })

    it('passes item, value, index and column to the column:{name} slot', () => {
      const received: { item: User; value: unknown; index: number; column: unknown }[] = []

      mountTable(
        {},
        {
          slots: {
            'column:name': (params: { item: User; value: unknown; index: number; column: unknown }) => {
              received.push(params)
              return params.value as string
            },
          },
        },
      )

      expect(received.map((r) => r.value)).toEqual(['Charlie', 'Alice', 'Bob'])
      expect(received.map((r) => r.item)).toEqual(users)
      expect(received.map((r) => r.index)).toEqual([0, 1, 2])
      expect(received.map((r) => r.column)).toEqual([columns[0], columns[0], columns[0]])
    })

    it('passes the raw value, not the formatted one, to the column:{name} slot', () => {
      const received: unknown[] = []

      const wrapper = mountTable(
        {
          items: [{ id: 1, name: 'Alice', age: 41 }],
          columns: [
            {
              name: 'age',
              label: 'Age',
              formatter: (value: number) => `${value} years`,
            },
          ],
        },
        {
          slots: {
            'column:age': (params: { value: unknown }) => {
              received.push(params.value)
              return `raw:${params.value}`
            },
          },
        },
      )

      expect(received).toEqual([41])
      expect(wrapper.find('tbody td').text()).toBe('raw:41')
    })

    it('only overrides the column it is named after', () => {
      const wrapper = mountTable(
        {},
        {
          slots: { 'column:name': '<em>slotted</em>' },
        },
      )

      expect(bodyRowTexts(wrapper)).toEqual([
        ['slotted', '30'],
        ['slotted', '41'],
        ['slotted', '25'],
      ])
    })

    it('renders an extra cell per row for the rowOptions slot', () => {
      const wrapper = mountTable({}, { slots: { rowOptions: '<button>Edit</button>' } })

      const rows = wrapper.findAll('tbody tr')

      expect(rows[0]!.findAll('td')).toHaveLength(3)
      expect(rows[0]!.find('td.vuiii-table__rowOptions button').text()).toBe('Edit')
      expect(wrapper.findAll('td.vuiii-table__rowOptions')).toHaveLength(3)
    })

    it('passes item and index to the rowOptions slot', () => {
      const wrapper = mountTable(
        {},
        {
          slots: {
            rowOptions: (params: { item: User; index: number }) => `${params.index}:${params.item.name}`,
          },
        },
      )

      expect(wrapper.findAll('td.vuiii-table__rowOptions').map((td) => td.text())).toEqual([
        '0:Charlie',
        '1:Alice',
        '2:Bob',
      ])
    })

    it('does not render the rowOptions cell when the slot is not provided', () => {
      const wrapper = mountTable()

      expect(wrapper.find('td.vuiii-table__rowOptions').exists()).toBe(false)
    })

    it('overrides the header content with a header:{name} slot', () => {
      const wrapper = mountTable(
        {},
        {
          slots: {
            'header:name': (params: { column: { label: string } }) => `[${params.column.label}]`,
          },
        },
      )

      expect(wrapper.findAll('thead th').map((th) => th.text())).toEqual(['[Name]', 'Age'])
    })

    it('renders the tools slot content in the header row', () => {
      const wrapper = mountTable({}, { slots: { tools: '<button>Tools</button>' } })

      expect(wrapper.find('thead th button').text()).toBe('Tools')
    })

    it('keeps the header and the body the same width when only the tools slot is given', () => {
      const wrapper = mountTable({}, { slots: { tools: '<b>x</b>' } })

      expect(wrapper.findAll('thead th')).toHaveLength(3)
      expect(wrapper.findAll('tbody tr')[0]!.findAll('td')).toHaveLength(3)
    })

    it('adds a header cell for the rowOptions column', () => {
      const wrapper = mountTable({}, { slots: { rowOptions: '<button>Edit</button>' } })

      expect(wrapper.findAll('thead th')).toHaveLength(3)
      expect(wrapper.findAll('tbody tr')[0]!.findAll('td')).toHaveLength(3)
    })

    it('spans the noDataMessage across every data column', () => {
      const wrapper = mountTable({ items: [], noDataMessage: 'Nothing here' })

      expect(wrapper.find('tbody td').attributes('colspan')).toBe('2')
    })

    it('spans the noDataMessage across the tools column as well', () => {
      const wrapper = mountTable({ items: [], noDataMessage: 'Nothing here' }, { slots: { tools: '<b>x</b>' } })

      expect(wrapper.findAll('thead th')).toHaveLength(3)
      expect(wrapper.find('tbody td').attributes('colspan')).toBe('3')
    })

    it('replaces the empty state with the noDataMessage slot', () => {
      const wrapper = mountTable({ items: [] }, { slots: { noDataMessage: '<p>Empty list</p>' } })

      expect(wrapper.find('tbody tr td p').text()).toBe('Empty list')
    })
  })

  describe('sorting', () => {
    it('marks sortable headers as interactive and non-sortable ones as not', () => {
      const wrapper = mountTable({
        columns: [
          { name: 'name', label: 'Name', sortable: true },
          { name: 'age', label: 'Age' },
        ],
      })

      const headers = wrapper.findAll('thead th')

      expect(headers[0]!.find('[role="button"]').exists()).toBe(true)
      expect(headers[0]!.attributes('aria-sort')).toBe('none')
      expect(headers[1]!.find('[role="button"]').exists()).toBe(false)
      expect(headers[1]!.attributes('aria-sort')).toBeUndefined()
    })

    it('leaves the rows in their original order when no sort column is set', () => {
      const wrapper = mountTable({ columns: sortableColumns })

      expect(bodyRowTexts(wrapper).map((cells) => cells[0])).toEqual(['Charlie', 'Alice', 'Bob'])
    })

    it('sorts ascending by the column whose sortable header is clicked', async () => {
      const wrapper = mountTable({ columns: sortableColumns })

      await wrapper.findAll('thead th [role="button"]')[0]!.trigger('click')

      expect(bodyRowTexts(wrapper).map((cells) => cells[0])).toEqual(['Alice', 'Bob', 'Charlie'])
    })

    it('emits sort and update:sortColumnName when a sortable header is clicked', async () => {
      const wrapper = mountTable({ columns: sortableColumns })

      await wrapper.findAll('thead th [role="button"]')[1]!.trigger('click')

      expect(wrapper.emitted('update:sortColumnName')![0]).toEqual(['age'])
      expect(wrapper.emitted('sort')![0]).toEqual([{ sortColumnName: 'age', sortDirection: 'asc' }])
    })

    it('emits update:sortDirection when the direction flips', async () => {
      const wrapper = mountTable({
        columns: sortableColumns,
        sortColumnName: 'age',
        sortDirection: 'asc',
      })

      await wrapper.findAll('thead th [role="button"]')[1]!.trigger('click')

      expect(wrapper.emitted('update:sortDirection')![0]).toEqual(['desc'])
    })

    it('toggles to descending when the same header is clicked again', async () => {
      const wrapper = mountTable({ columns: sortableColumns })

      const nameHeader = wrapper.findAll('thead th [role="button"]')[0]!
      await nameHeader.trigger('click')
      await nameHeader.trigger('click')

      expect(wrapper.emitted('sort')![1]).toEqual([{ sortColumnName: 'name', sortDirection: 'desc' }])
      expect(bodyRowTexts(wrapper).map((cells) => cells[0])).toEqual(['Charlie', 'Bob', 'Alice'])
    })

    it('restarts at ascending when a different column is sorted', async () => {
      const wrapper = mountTable({
        columns: sortableColumns,
        sortColumnName: 'name',
        sortDirection: 'desc',
      })

      await wrapper.findAll('thead th [role="button"]')[1]!.trigger('click')

      expect(wrapper.emitted('sort')![0]).toEqual([{ sortColumnName: 'age', sortDirection: 'asc' }])
    })

    it('sorts numeric columns numerically', async () => {
      const wrapper = mountTable({
        columns: sortableColumns,
        sortColumnName: 'age',
      })

      expect(bodyRowTexts(wrapper).map((cells) => cells[1])).toEqual(['25', '30', '41'])

      await wrapper.setProps({ sortDirection: 'desc' })

      expect(bodyRowTexts(wrapper).map((cells) => cells[1])).toEqual(['41', '30', '25'])
    })

    it('sorts by the initial sortColumnName / sortDirection props without any interaction', () => {
      const wrapper = mountTable({
        columns: sortableColumns,
        sortColumnName: 'name',
        sortDirection: 'desc',
      })

      expect(bodyRowTexts(wrapper).map((cells) => cells[0])).toEqual(['Charlie', 'Bob', 'Alice'])
    })

    it('reflects the current sort state in the aria-sort attribute of the header', async () => {
      const wrapper = mountTable({ columns: sortableColumns })

      await wrapper.findAll('thead th [role="button"]')[0]!.trigger('click')

      expect(wrapper.findAll('thead th').map((th) => th.attributes('aria-sort'))).toEqual(['ascending', 'none'])

      await wrapper.findAll('thead th [role="button"]')[0]!.trigger('click')

      expect(wrapper.findAll('thead th').map((th) => th.attributes('aria-sort'))).toEqual(['descending', 'none'])
    })

    it('marks the sorted header label with the active sort modifier class', async () => {
      const wrapper = mountTable({ columns: sortableColumns })

      const labels = wrapper.findAll('thead th [role="button"]')
      await labels[0]!.trigger('click')

      expect(labels[0]!.classes()).toContain('vuiii-table__label--activeSort')
      expect(labels[1]!.classes()).not.toContain('vuiii-table__label--activeSort')
    })

    it('sorts using a custom sorter defined on the column', () => {
      const wrapper = mountTable({
        columns: [
          {
            name: 'name',
            label: 'Name',
            sortable: true,
            sorter: (a: string, b: string) => b.localeCompare(a),
          },
        ],
        sortColumnName: 'name',
      })

      expect(bodyRowTexts(wrapper).map((cells) => cells[0])).toEqual(['Charlie', 'Bob', 'Alice'])
    })

    it('sorts by the extracted value rather than the raw property', () => {
      const wrapper = mountTable({
        columns: [
          {
            name: 'lastDigit',
            label: 'Last digit',
            sortable: true,
            value: (item: User) => item.age % 10,
          },
        ],
        sortColumnName: 'lastDigit',
      })

      expect(bodyRowTexts(wrapper).map((cells) => cells[0])).toEqual(['0', '1', '5'])
    })

    it('keeps rows with an empty value at one end when sorting', () => {
      const wrapper = mountTable({
        items: [{ name: 'A' }, { name: null }, { name: 'B' }],
        columns: [{ name: 'name', label: 'Name', sortable: true }],
        sortColumnName: 'name',
      })

      expect(bodyRowTexts(wrapper).map((cells) => cells[0])).toEqual(['A', 'B', ''])
    })

    it('sorts on Enter and Space keydown on a sortable header', async () => {
      const wrapper = mountTable({ columns: sortableColumns })

      const nameHeader = wrapper.findAll('thead th [role="button"]')[0]!
      await nameHeader.trigger('keydown.enter')

      expect(wrapper.emitted('sort')![0]).toEqual([{ sortColumnName: 'name', sortDirection: 'asc' }])

      await nameHeader.trigger('keydown.space')

      expect(wrapper.emitted('sort')![1]).toEqual([{ sortColumnName: 'name', sortDirection: 'desc' }])
    })

    it('does not sort when a non-sortable header is clicked', async () => {
      const wrapper = mountTable({ columns })

      await wrapper.findAll('thead th')[0]!.trigger('click')

      expect(wrapper.emitted('sort')).toBeFalsy()
      expect(bodyRowTexts(wrapper).map((cells) => cells[0])).toEqual(['Charlie', 'Alice', 'Bob'])
    })
  })

  describe('row interaction', () => {
    it('emits click-row with the item and its index when a row is clicked', async () => {
      const wrapper = mountTable()

      await wrapper.findAll('tbody tr')[1]!.trigger('click')

      expect(wrapper.emitted('click-row')![0]).toEqual([{ item: users[1], index: 1 }])
    })

    it('reports the index within the sorted order when a row is clicked', async () => {
      const wrapper = mountTable({
        columns: sortableColumns,
        sortColumnName: 'name',
      })

      await wrapper.findAll('tbody tr')[0]!.trigger('click')

      expect(wrapper.emitted('click-row')![0]).toEqual([{ item: users[1], index: 0 }])
    })

    it('does not emit click-row when the rowOptions cell is clicked', async () => {
      const wrapper = mountTable({}, { slots: { rowOptions: '<button>Edit</button>' } })

      await wrapper.find('td.vuiii-table__rowOptions').trigger('click')

      expect(wrapper.emitted('click-row')).toBeFalsy()
    })

    it('emits mouseenter-row and mouseleave-row with the item and index', async () => {
      const wrapper = mountTable()

      const row = wrapper.findAll('tbody tr')[2]!
      await row.trigger('mouseenter')
      await row.trigger('mouseleave')

      expect(wrapper.emitted('mouseenter-row')![0]).toEqual([{ item: users[2], index: 2 }])
      expect(wrapper.emitted('mouseleave-row')![0]).toEqual([{ item: users[2], index: 2 }])
    })

    it('applies a rowClass computed from the item and index', () => {
      const wrapper = mountTable({
        rowClass: ({ item }: { item: User }) => (item.age > 30 ? 'is-senior' : 'is-junior'),
      })

      expect(wrapper.findAll('tbody tr').map((row) => row.classes().includes('is-senior'))).toEqual([
        false,
        true,
        false,
      ])
    })

    it('applies a static rowClass string to every row', () => {
      const wrapper = mountTable({ rowClass: 'clickable' })

      expect(wrapper.findAll('tbody tr').every((row) => row.classes().includes('clickable'))).toBe(true)
    })
  })

  describe('highlightOnHover', () => {
    it('does not mark the table as hoverable by default', () => {
      const wrapper = mountTable()

      expect(wrapper.find('table').classes()).not.toContain('vuiii-table--hover')
    })

    it('marks the table as hoverable when there are rows to highlight', () => {
      const wrapper = mountTable({ highlightOnHover: true })

      expect(wrapper.find('table').classes()).toContain('vuiii-table--hover')
    })

    it('does not mark an empty table as hoverable', () => {
      const wrapper = mountTable({ highlightOnHover: true, items: [] })

      expect(wrapper.find('table').classes()).not.toContain('vuiii-table--hover')
    })
  })

  describe('size', () => {
    it('renders without a size modifier class by default', () => {
      const wrapper = mountTable()

      expect(
        wrapper
          .find('table')
          .classes()
          .some((c) => c.startsWith('vuiii-table--size-')),
      ).toBe(false)
    })

    it.each(['small', 'normal', 'large'])('applies the %s size modifier class', (size) => {
      const wrapper = mountTable({ size })

      expect(wrapper.find('table').classes()).toContain(`vuiii-table--size-${size}`)
    })
  })
})
