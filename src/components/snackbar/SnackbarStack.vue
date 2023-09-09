<template>
  <Teleport to="body">
    <div class="Snackbar">
      <TransitionGroup name="Snackbar__transition">
        <div v-for="(message, index) in messagesInReverse" :key="message.id" class="Snackbar__message">
          <div class="Snackbar__messageWrapper" :style="{ transform: `translateY(-${100 * index}%)` }">
            <div class="Snackbar__messageBlock" :class="`Snackbar__messageBlock--${message.type}`">
              <div>
                {{ message.text }}
              </div>

              <div class="Snackbar__messageClose" @click="removeMessage(message.id)">
                <Icon class="Snackbar__messageCloseIcon" name="x" />
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import { type Message, messages, removeMessage } from '../../snackbar'
import Icon from '../Icon.vue'

const messagesInReverse = computed<Message[]>(() => [...messages.value].reverse())
</script>

<style lang="postcss" scoped>
.Snackbar {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: var(--vuiii-zIndex-snackbar);
  margin: 2rem;
}

.Snackbar__transition-enter-from,
.Snackbar__transition-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}

.Snackbar__transition-enter-active,
.Snackbar__transition-leave-active {
  transition: all 0.15s ease-out;
}

.Snackbar__transition-enter-to,
.Snackbar__transition-leave-from {
  opacity: 1;
}

.Snackbar__message {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  width: max-content;
  max-width: 48rem; /* max-w-3xl */
  pointer-events: none;
  word-break: break-word;
}

.Snackbar__messageWrapper {
  padding-top: 0.5rem;
  transition: transform 0.15s ease-in;
}

.Snackbar__messageBlock {
  display: inline-flex;
  align-items: flex-start;
  padding: 0.75rem 1.5rem;
  color: white;
  border-radius: 0.25rem;
  cursor: default;
  pointer-events: auto;
  user-select: none;
}

.Snackbar__messageBlock--success {
  background-color: black;
}

.Snackbar__messageBlock--error {
  background-color: var(--vuiii-color-danger);
}

.Snackbar__messageClose {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem;
  margin: -0.75rem -0.75rem -0.75rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.5;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
}

.Snackbar__messageCloseIcon {
  width: 1rem;
}
</style>
