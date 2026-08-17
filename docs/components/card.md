# Card

Simple content container with an optional header (title + tools) and a body.
Shares its padding and border-radius tokens with Dialog.

## Import

```typescript
import { Card } from 'vuiii'
```

## Basic Usage

<script setup>
import { Card, IconButton, Icon } from '../../src'
</script>

<ComponentDemo storybook="components-card--default">
  <Card title="Profile">
    Card body content
  </Card>
</ComponentDemo>

```vue
import { Card } from 'vuiii'

<Card title="Profile">
  Card body content
</Card>
```

## Props

| Prop    | Type     | Default | Description                       |
| ------- | -------- | ------- | --------------------------------- |
| `title` | `string` | -       | Text rendered in the card header  |

The header is only rendered when a `title`, or the `header`, `title`, or `tools` slot is provided.

## Slots

| Slot      | Description                                                        |
| --------- | ----------------------------------------------------------------- |
| `default` | Card body content                                                 |
| `header`  | Overrides the whole header-left region (default renders the title) |
| `title`   | Overrides just the title text (default is the `title` prop)       |
| `tools`   | Content rendered on the right side of the header                  |

## Events

The Card emits no custom events.

## More Examples

### With Header Tools

Tools are rendered on the right side of the header.

<ComponentDemo>
  <Card title="Members">
    <template #tools>
      <IconButton icon="plus" />
    </template>
    Team members list
  </Card>
</ComponentDemo>

```vue
<Card title="Members">
  <template #tools>
    <IconButton icon="plus" @click="add()" />
  </template>
  Team members list
</Card>
```

### Custom Title

Use the `title` slot to render richer content in place of the plain title text.

<ComponentDemo>
  <Card>
    <template #title><Icon name="exclamation" /> Needs attention</template>
    Card body content
  </Card>
</ComponentDemo>

```vue
<Card>
  <template #title><Icon name="exclamation" /> Needs attention</template>
  Card body content
</Card>
```

### Without Header

Omit the `title` prop and all header slots to render a body-only card.

<ComponentDemo>
  <Card>Just a body, no header</Card>
</ComponentDemo>

```vue
<Card>Just a body, no header</Card>
```

::: tip Storybook
For interactive examples, see [Card in Storybook](https://greegus.github.io/vuiii/storybook/?path=/docs/components-card--docs).
:::
