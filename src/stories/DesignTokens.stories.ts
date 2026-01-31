import { type Meta, StoryObj } from "@storybook/vue3-vite";
import { defineComponent, h } from "vue";

// Helper component for rendering token documentation
const TokenDocs = defineComponent({
  name: "TokenDocs",
  props: {
    title: String,
  },
  setup(props, { slots }) {
    return () =>
      h(
        "div",
        { style: { padding: "2rem", maxWidth: "1200px", margin: "0 auto" } },
        [
          props.title &&
            h(
              "h1",
              {
                style: {
                  fontSize: "2rem",
                  fontWeight: "600",
                  marginBottom: "1.5rem",
                  borderBottom: "1px solid #e5e5e5",
                  paddingBottom: "0.5rem",
                },
              },
              props.title
            ),
          slots.default?.(),
        ]
      );
  },
});

// Color swatch component
const ColorSwatch = defineComponent({
  name: "ColorSwatch",
  props: {
    name: { type: String, required: true },
    cssVar: { type: String, required: true },
    value: String,
  },
  setup(props) {
    return () =>
      h(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "0.5rem",
            borderRadius: "0.25rem",
          },
        },
        [
          h("div", {
            style: {
              width: "3rem",
              height: "3rem",
              borderRadius: "0.25rem",
              backgroundColor: `var(${props.cssVar})`,
              border: "1px solid #e5e5e5",
              flexShrink: "0",
            },
          }),
          h("div", { style: { flex: "1", minWidth: "0" } }, [
            h(
              "code",
              {
                style: {
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  display: "block",
                },
              },
              props.cssVar
            ),
            props.value &&
              h(
                "span",
                {
                  style: {
                    fontSize: "0.75rem",
                    color: "#666",
                    display: "block",
                    marginTop: "0.25rem",
                  },
                },
                props.value
              ),
          ]),
        ]
      );
  },
});

// Token table component
const TokenTable = defineComponent({
  name: "TokenTable",
  props: {
    tokens: {
      type: Array as () => Array<{ name: string; value: string; description?: string }>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        "table",
        {
          style: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
            marginBottom: "2rem",
          },
        },
        [
          h("thead", [
            h(
              "tr",
              {
                style: {
                  borderBottom: "2px solid #e5e5e5",
                  textAlign: "left",
                },
              },
              [
                h("th", { style: { padding: "0.75rem", fontWeight: "600" } }, "Token"),
                h("th", { style: { padding: "0.75rem", fontWeight: "600" } }, "Value"),
                h("th", { style: { padding: "0.75rem", fontWeight: "600" } }, "Description"),
              ]
            ),
          ]),
          h(
            "tbody",
            props.tokens.map((token, index) =>
              h(
                "tr",
                {
                  key: index,
                  style: {
                    borderBottom: "1px solid #f0f0f0",
                  },
                },
                [
                  h("td", { style: { padding: "0.75rem" } }, [
                    h("code", { style: { fontSize: "0.8rem" } }, token.name),
                  ]),
                  h("td", { style: { padding: "0.75rem", fontFamily: "monospace", fontSize: "0.8rem" } }, token.value),
                  h("td", { style: { padding: "0.75rem", color: "#666" } }, token.description || ""),
                ]
              )
            )
          ),
        ]
      );
  },
});

export default {
  title: "Design Tokens",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "CSS custom properties (design tokens) used throughout the VUIII component library. Override these in your CSS to customize the theme.",
      },
    },
  },
} as Meta;

export const Overview: StoryObj = {
  render: () => ({
    components: { TokenDocs },
    template: `
      <TokenDocs title="Design Tokens Overview">
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">What are Design Tokens?</h2>
          <p style="line-height: 1.6; color: #333; margin-bottom: 1rem;">
            Design tokens are CSS custom properties (variables) that define the visual foundation of VUIII components.
            They control colors, typography, spacing, and other visual properties throughout the library.
          </p>
          <p style="line-height: 1.6; color: #333; margin-bottom: 1rem;">
            All tokens are defined in the <code>:root</code> selector and follow the naming convention:
            <code>--vuiii-{category}-{property}--{modifier}</code>
          </p>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Token Categories</h2>
          <ul style="line-height: 1.8; padding-left: 1.5rem;">
            <li><strong>Colors</strong> — Base and semantic color palette</li>
            <li><strong>Typography</strong> — Font families, sizes, and text styles</li>
            <li><strong>Fields</strong> — Shared properties for form inputs</li>
            <li><strong>Buttons</strong> — Button variants and states</li>
            <li><strong>Inputs</strong> — Text input styling</li>
            <li><strong>Components</strong> — Divider, checkbox, icon, table, dialog, dropdown</li>
            <li><strong>Z-Index</strong> — Layering for overlays and modals</li>
          </ul>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Naming Convention</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid #e5e5e5; text-align: left;">
                <th style="padding: 0.75rem;">Pattern</th>
                <th style="padding: 0.75rem;">Example</th>
                <th style="padding: 0.75rem;">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 0.75rem;"><code>--vuiii-{category}</code></td>
                <td style="padding: 0.75rem;"><code>--vuiii-fontSize</code></td>
                <td style="padding: 0.75rem;">Base token</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 0.75rem;"><code>--vuiii-{category}--{variant}</code></td>
                <td style="padding: 0.75rem;"><code>--vuiii-fontSize--small</code></td>
                <td style="padding: 0.75rem;">Size/variant modifier</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 0.75rem;"><code>--vuiii-{component}-{property}</code></td>
                <td style="padding: 0.75rem;"><code>--vuiii-button-bgColor</code></td>
                <td style="padding: 0.75rem;">Component property</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 0.75rem;"><code>--vuiii-{component}-{property}--{state}</code></td>
                <td style="padding: 0.75rem;"><code>--vuiii-button-bgColor--hover</code></td>
                <td style="padding: 0.75rem;">State modifier</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">How to Override Tokens</h2>
          <p style="line-height: 1.6; color: #333; margin-bottom: 1rem;">
            Override tokens in your CSS by redefining them in <code>:root</code> or scoped to a specific element:
          </p>
          <pre style="background: #f5f5f5; padding: 1rem; border-radius: 0.25rem; overflow-x: auto; font-size: 0.85rem;"><code>/* Global override */
:root {
  --vuiii-color-primary: #0066cc;
  --vuiii-field-borderRadius: 0.5em;
}

/* Scoped override */
.dark-theme {
  --vuiii-color-light: #1a1a1a;
  --vuiii-color-dark: #ffffff;
}</code></pre>
        </section>
      </TokenDocs>
    `,
  }),
};

export const Colors: StoryObj = {
  render: () => ({
    components: { TokenDocs, ColorSwatch },
    template: `
      <TokenDocs title="Color Tokens">
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Base Colors</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem;">
            <ColorSwatch name="White" cssVar="--vuiii-color-white" value="white" />
            <ColorSwatch name="Black" cssVar="--vuiii-color-black" value="black" />
            <ColorSwatch name="Light" cssVar="--vuiii-color-light" value="var(--vuiii-color-white)" />
            <ColorSwatch name="Dark" cssVar="--vuiii-color-dark" value="var(--vuiii-color-black)" />
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Gray Scale</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem;">
            <ColorSwatch name="Gray Lightest" cssVar="--vuiii-color-gray--lightest" value="rgb(250 250 250)" />
            <ColorSwatch name="Gray Lighter" cssVar="--vuiii-color-gray--lighter" value="rgb(245 245 245)" />
            <ColorSwatch name="Gray Light" cssVar="--vuiii-color-gray--light" value="rgb(229 229 229)" />
            <ColorSwatch name="Gray" cssVar="--vuiii-color-gray" value="rgb(212 212 216)" />
            <ColorSwatch name="Gray Dark" cssVar="--vuiii-color-gray--dark" value="rgb(163 163 163)" />
            <ColorSwatch name="Gray Darker" cssVar="--vuiii-color-gray--darker" value="rgb(115 115 115)" />
            <ColorSwatch name="Gray Darkest" cssVar="--vuiii-color-gray--darkest" value="rgb(82 82 82)" />
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Semantic Colors</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem;">
            <ColorSwatch name="Primary" cssVar="--vuiii-color-primary" value="rgb(79 70 229) — indigo.600" />
            <ColorSwatch name="Primary Darker" cssVar="--vuiii-color-primary--darker" value="color-mix 95% black" />
            <ColorSwatch name="Primary Darkest" cssVar="--vuiii-color-primary--darkest" value="color-mix 85% black" />
            <ColorSwatch name="Danger" cssVar="--vuiii-color-danger" value="rgb(225 29 72) — rose.600" />
            <ColorSwatch name="Danger Darker" cssVar="--vuiii-color-danger--darker" value="color-mix 95% black" />
            <ColorSwatch name="Success" cssVar="--vuiii-color-success" value="rgb(77 124 15) — lime.700" />
            <ColorSwatch name="Success Darker" cssVar="--vuiii-color-success--darker" value="color-mix 95% black" />
            <ColorSwatch name="Warning" cssVar="--ui-color-warning" value="rgb(234 179 8) — amber.400" />
            <ColorSwatch name="Warning Darker" cssVar="--ui-color-warning--darker" value="color-mix 95% black" />
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Shadows</h2>
          <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
            <div style="padding: 2rem; background: white; border-radius: 0.5rem; box-shadow: var(--vuiii-shadow);">
              <code style="font-size: 0.8rem;">--vuiii-shadow</code>
              <p style="font-size: 0.75rem; color: #666; margin-top: 0.5rem;">Default shadow</p>
            </div>
            <div style="padding: 2rem; background: white; border-radius: 0.5rem; box-shadow: var(--vuiii-shadow--large);">
              <code style="font-size: 0.8rem;">--vuiii-shadow--large</code>
              <p style="font-size: 0.75rem; color: #666; margin-top: 0.5rem;">Large shadow</p>
            </div>
          </div>
        </section>
      </TokenDocs>
    `,
  }),
};

export const Typography: StoryObj = {
  render: () => ({
    components: { TokenDocs },
    template: `
      <TokenDocs title="Typography Tokens">
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Typefaces</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-bottom: 1rem;">
            <thead>
              <tr style="border-bottom: 2px solid #e5e5e5; text-align: left;">
                <th style="padding: 0.75rem;">Token</th>
                <th style="padding: 0.75rem;">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 0.75rem;"><code>--vuiii-typeface-body</code></td>
                <td style="padding: 0.75rem; font-family: var(--vuiii-typeface-body);">"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif</td>
              </tr>
              <tr style="border-bottom: 1px solid #f0f0f0;">
                <td style="padding: 0.75rem;"><code>--vuiii-typeface-display</code></td>
                <td style="padding: 0.75rem; font-family: var(--vuiii-typeface-display);">var(--vuiii-typeface-body)</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Font Size Scale</h2>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <code style="min-width: 200px; font-size: 0.8rem;">--vuiii-fontSize--tiny</code>
              <span style="font-size: var(--vuiii-fontSize--tiny);">0.75rem — The quick brown fox</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <code style="min-width: 200px; font-size: 0.8rem;">--vuiii-fontSize--small</code>
              <span style="font-size: var(--vuiii-fontSize--small);">0.85rem — The quick brown fox</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <code style="min-width: 200px; font-size: 0.8rem;">--vuiii-fontSize</code>
              <span style="font-size: var(--vuiii-fontSize);">1rem — The quick brown fox</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <code style="min-width: 200px; font-size: 0.8rem;">--vuiii-fontSize--large</code>
              <span style="font-size: var(--vuiii-fontSize--large);">1.25rem — The quick brown fox</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <code style="min-width: 200px; font-size: 0.8rem;">--vuiii-fontSize--x-large</code>
              <span style="font-size: var(--vuiii-fontSize--x-large);">1.5rem — The quick brown fox</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <code style="min-width: 200px; font-size: 0.8rem;">--vuiii-fontSize--2x-large</code>
              <span style="font-size: var(--vuiii-fontSize--2x-large);">2rem — The quick brown fox</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <code style="min-width: 200px; font-size: 0.8rem;">--vuiii-fontSize--3x-large</code>
              <span style="font-size: var(--vuiii-fontSize--3x-large);">3rem — Quick fox</span>
            </div>
            <div style="display: flex; align-items: baseline; gap: 1rem;">
              <code style="min-width: 200px; font-size: 0.8rem;">--vuiii-fontSize--4x-large</code>
              <span style="font-size: var(--vuiii-fontSize--4x-large);">4rem — Fox</span>
            </div>
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Typography Variants</h2>
          <p style="line-height: 1.6; color: #666; margin-bottom: 1rem;">
            Each variant has tokens for: fontSize, fontWeight, lineHeight, textTransform, color, opacity
          </p>
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <div style="border-left: 3px solid var(--vuiii-color-primary); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-display-fontSize); font-weight: var(--vuiii-typography-display-fontWeight); line-height: var(--vuiii-typography-display-lineHeight);">Display</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-display-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-primary); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-heading1-fontSize); font-weight: var(--vuiii-typography-heading1-fontWeight); line-height: var(--vuiii-typography-heading1-lineHeight);">Heading 1</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-heading1-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-primary); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-heading2-fontSize); font-weight: var(--vuiii-typography-heading2-fontWeight); line-height: var(--vuiii-typography-heading2-lineHeight);">Heading 2</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-heading2-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-primary); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-heading3-fontSize); font-weight: var(--vuiii-typography-heading3-fontWeight); line-height: var(--vuiii-typography-heading3-lineHeight);">Heading 3</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-heading3-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-primary); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-heading4-fontSize); font-weight: var(--vuiii-typography-heading4-fontWeight); line-height: var(--vuiii-typography-heading4-lineHeight);">Heading 4</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-heading4-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-primary); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-heading5-fontSize); font-weight: var(--vuiii-typography-heading5-fontWeight); line-height: var(--vuiii-typography-heading5-lineHeight);">Heading 5</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-heading5-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-primary); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-heading6-fontSize); font-weight: var(--vuiii-typography-heading6-fontWeight); line-height: var(--vuiii-typography-heading6-lineHeight);">Heading 6</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-heading6-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-gray); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-body1-fontSize); font-weight: var(--vuiii-typography-body1-fontWeight); line-height: var(--vuiii-typography-body1-lineHeight);">Body 1 — Regular paragraph text for main content</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-body1-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-gray); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-body2-fontSize); font-weight: var(--vuiii-typography-body2-fontWeight); line-height: var(--vuiii-typography-body2-lineHeight); opacity: var(--vuiii-typography-body2-opacity);">Body 2 — Secondary text with reduced opacity</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-body2-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-gray); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-label-fontSize); font-weight: var(--vuiii-typography-label-fontWeight); line-height: var(--vuiii-typography-label-lineHeight);">Label</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-label-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-gray); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-caption-fontSize); font-weight: var(--vuiii-typography-caption-fontWeight); line-height: var(--vuiii-typography-caption-lineHeight); text-transform: var(--vuiii-typography-caption-textTransform); opacity: var(--vuiii-typography-caption-opacity);">Caption</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-caption-*</code>
            </div>
            <div style="border-left: 3px solid var(--vuiii-color-gray); padding-left: 1rem;">
              <div style="font-size: var(--vuiii-typography-description-fontSize); font-weight: var(--vuiii-typography-description-fontWeight); line-height: var(--vuiii-typography-description-lineHeight); opacity: var(--vuiii-typography-description-opacity);">Description — Helper text for form fields</div>
              <code style="font-size: 0.75rem; color: #666;">--vuiii-typography-description-*</code>
            </div>
          </div>
        </section>
      </TokenDocs>
    `,
  }),
};

export const Fields: StoryObj = {
  render: () => ({
    components: { TokenDocs, TokenTable },
    template: `
      <TokenDocs title="Field Tokens">
        <p style="line-height: 1.6; color: #666; margin-bottom: 1.5rem;">
          Base tokens shared by form inputs (Input, Select, Textarea). Component-specific tokens inherit from these.
        </p>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Base Field Tokens</h2>
          <TokenTable :tokens="baseTokens" />
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Field States</h2>
          <TokenTable :tokens="stateTokens" />
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Size Variants</h2>
          <p style="color: #666; margin-bottom: 1rem;">Each size has: height, padding, borderRadius, fontSize, ringSize</p>
          <TokenTable :tokens="sizeTokens" />
        </section>
      </TokenDocs>
    `,
    setup() {
      const baseTokens = [
        { name: "--vuiii-field-height", value: "2.5em", description: "Default field height" },
        { name: "--vuiii-field-padding", value: "1.35em", description: "Horizontal padding" },
        { name: "--vuiii-field-borderRadius", value: "0.25em", description: "Corner radius" },
        { name: "--vuiii-field-fontSize", value: "var(--vuiii-fontSize)", description: "Text size" },
        { name: "--vuiii-field-borderWidth", value: "1px", description: "Border thickness" },
        { name: "--vuiii-field-bgColor", value: "var(--vuiii-color-white)", description: "Background color" },
        { name: "--vuiii-field-borderColor", value: "var(--vuiii-color-gray)", description: "Border color" },
        { name: "--vuiii-field-ringColor", value: "color-mix(...)", description: "Focus ring color" },
        { name: "--vuiii-field-ringSize", value: "0.25em", description: "Focus ring width" },
        { name: "--vuiii-field-transition", value: "all 0.05s ease-in-out", description: "Animation timing" },
        { name: "--vuiii-field-opacity--disabled", value: "0.6", description: "Disabled state opacity" },
      ];
      const stateTokens = [
        { name: "--vuiii-field-borderColor--active", value: "var(--vuiii-color-gray--dark)", description: "Active state border" },
        { name: "--vuiii-field-borderColor--focus", value: "var(--vuiii-color-gray--dark)", description: "Focus state border" },
        { name: "--vuiii-field-borderColor--invalid", value: "var(--vuiii-color-danger)", description: "Invalid state border" },
      ];
      const sizeTokens = [
        { name: "--vuiii-field-fontSize--small", value: "var(--vuiii-fontSize--small)", description: "Small size font" },
        { name: "--vuiii-field-height--small", value: "var(--vuiii-field-height)", description: "Small size height" },
        { name: "--vuiii-field-fontSize--large", value: "var(--vuiii-fontSize--large)", description: "Large size font" },
        { name: "--vuiii-field-height--large", value: "var(--vuiii-field-height)", description: "Large size height" },
      ];
      return { baseTokens, stateTokens, sizeTokens };
    },
  }),
};

export const Buttons: StoryObj = {
  render: () => ({
    components: { TokenDocs, TokenTable },
    template: `
      <TokenDocs title="Button Tokens">
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Base Button Tokens</h2>
          <TokenTable :tokens="baseTokens" />
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Button Variants</h2>
          <p style="color: #666; margin-bottom: 1rem;">Each variant has: bgColor, borderColor, textColor, ringColor, and hover states</p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
            <div style="padding: 1rem; border: 1px solid #e5e5e5; border-radius: 0.5rem;">
              <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Default</h3>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor); border: 1px solid #e5e5e5; border-radius: 0.25rem;" title="bgColor"></div>
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-textColor); border-radius: 0.25rem;" title="textColor"></div>
              </div>
              <code style="font-size: 0.7rem;">--vuiii-button-bgColor</code><br/>
              <code style="font-size: 0.7rem;">--vuiii-button-textColor</code>
            </div>

            <div style="padding: 1rem; border: 1px solid #e5e5e5; border-radius: 0.5rem;">
              <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Primary</h3>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor--primary); border-radius: 0.25rem;" title="bgColor"></div>
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor--primary--hover); border-radius: 0.25rem;" title="bgColor hover"></div>
              </div>
              <code style="font-size: 0.7rem;">--vuiii-button-bgColor--primary</code><br/>
              <code style="font-size: 0.7rem;">--vuiii-button-textColor--primary</code>
            </div>

            <div style="padding: 1rem; border: 1px solid #e5e5e5; border-radius: 0.5rem;">
              <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Secondary</h3>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor--secondary); border-radius: 0.25rem;" title="bgColor"></div>
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor--secondary--hover); border-radius: 0.25rem;" title="bgColor hover"></div>
              </div>
              <code style="font-size: 0.7rem;">--vuiii-button-bgColor--secondary</code><br/>
              <code style="font-size: 0.7rem;">--vuiii-button-textColor--secondary</code>
            </div>

            <div style="padding: 1rem; border: 1px solid #e5e5e5; border-radius: 0.5rem;">
              <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Danger</h3>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor--danger); border-radius: 0.25rem;" title="bgColor"></div>
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor--danger--hover); border-radius: 0.25rem;" title="bgColor hover"></div>
              </div>
              <code style="font-size: 0.7rem;">--vuiii-button-bgColor--danger</code><br/>
              <code style="font-size: 0.7rem;">--vuiii-button-textColor--danger</code>
            </div>

            <div style="padding: 1rem; border: 1px solid #e5e5e5; border-radius: 0.5rem;">
              <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem;">Success</h3>
              <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor--success); border-radius: 0.25rem;" title="bgColor"></div>
                <div style="width: 2rem; height: 2rem; background: var(--vuiii-button-bgColor--success--hover); border-radius: 0.25rem;" title="bgColor hover"></div>
              </div>
              <code style="font-size: 0.7rem;">--vuiii-button-bgColor--success</code><br/>
              <code style="font-size: 0.7rem;">--vuiii-button-textColor--success</code>
            </div>
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Size Variants</h2>
          <TokenTable :tokens="sizeTokens" />
        </section>
      </TokenDocs>
    `,
    setup() {
      const baseTokens = [
        { name: "--vuiii-button-fontSize", value: "var(--vuiii-field-fontSize)", description: "Inherits from field" },
        { name: "--vuiii-button-fontFamily", value: "var(--vuiii-typeface-body)", description: "Font family" },
        { name: "--vuiii-button-fontWeight", value: "normal", description: "Text weight" },
        { name: "--vuiii-button-height", value: "var(--vuiii-field-height)", description: "Inherits from field" },
        { name: "--vuiii-button-padding", value: "var(--vuiii-field-padding)", description: "Inherits from field" },
        { name: "--vuiii-button-borderRadius", value: "var(--vuiii-field-borderRadius)", description: "Inherits from field" },
        { name: "--vuiii-button-borderWidth", value: "var(--vuiii-field-borderWidth)", description: "Inherits from field" },
        { name: "--vuiii-button-transition", value: "var(--vuiii-field-transition)", description: "Animation timing" },
        { name: "--vuiii-button-opacity--disabled", value: "var(--vuiii-field-opacity--disabled)", description: "Disabled opacity" },
      ];
      const sizeTokens = [
        { name: "--vuiii-button-fontSize--small", value: "var(--vuiii-field-fontSize)", description: "Small font size" },
        { name: "--vuiii-button-height--small", value: "var(--vuiii-field-height--small)", description: "Small height" },
        { name: "--vuiii-button-fontSize--large", value: "var(--vuiii-field-fontSize--large)", description: "Large font size" },
        { name: "--vuiii-button-height--large", value: "var(--vuiii-field-height--large)", description: "Large height" },
      ];
      return { baseTokens, sizeTokens };
    },
  }),
};

export const Inputs: StoryObj = {
  render: () => ({
    components: { TokenDocs, TokenTable },
    template: `
      <TokenDocs title="Input Tokens">
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Base Input Tokens</h2>
          <TokenTable :tokens="baseTokens" />
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Validity States</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
            <div style="padding: 1rem; border: 2px solid var(--vuiii-input-borderColor--valid); border-radius: 0.5rem;">
              <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--vuiii-input-textColor--valid);">Valid State</h3>
              <code style="font-size: 0.7rem; display: block;">--vuiii-input-textColor--valid</code>
              <code style="font-size: 0.7rem; display: block;">--vuiii-input-borderColor--valid</code>
              <code style="font-size: 0.7rem; display: block;">--vuiii-input-ringColor--valid</code>
            </div>
            <div style="padding: 1rem; border: 2px solid var(--vuiii-input-borderColor--invalid); border-radius: 0.5rem;">
              <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--vuiii-input-textColor--invalid);">Invalid State</h3>
              <code style="font-size: 0.7rem; display: block;">--vuiii-input-textColor--invalid</code>
              <code style="font-size: 0.7rem; display: block;">--vuiii-input-borderColor--invalid</code>
              <code style="font-size: 0.7rem; display: block;">--vuiii-input-ringColor--invalid</code>
            </div>
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Size Variants</h2>
          <TokenTable :tokens="sizeTokens" />
        </section>
      </TokenDocs>
    `,
    setup() {
      const baseTokens = [
        { name: "--vuiii-input-height", value: "var(--vuiii-field-height)", description: "Inherits from field" },
        { name: "--vuiii-input-padding", value: "var(--vuiii-field-padding)", description: "Inherits from field" },
        { name: "--vuiii-input-fontSize", value: "var(--vuiii-field-fontSize)", description: "Inherits from field" },
        { name: "--vuiii-input-borderRadius", value: "var(--vuiii-field-borderRadius)", description: "Inherits from field" },
        { name: "--vuiii-input-textColor", value: "inherit", description: "Text color" },
        { name: "--vuiii-input-borderColor", value: "var(--vuiii-field-borderColor)", description: "Border color" },
        { name: "--vuiii-input-borderColor--focus", value: "color-mix(...)", description: "Focus border color" },
        { name: "--vuiii-input-bgColor", value: "var(--vuiii-color-white)", description: "Background color" },
        { name: "--vuiii-input-placeholderColor", value: "color-mix(currentColor 50%)", description: "Placeholder text" },
        { name: "--vuiii-input-iconColor", value: "color-mix(currentColor 50%)", description: "Icon color" },
        { name: "--vuiii-input-shadow", value: "0 0", description: "Box shadow" },
      ];
      const sizeTokens = [
        { name: "--vuiii-input-height--small", value: "var(--vuiii-field-height--small)", description: "Small height" },
        { name: "--vuiii-input-fontSize--small", value: "var(--vuiii-field-fontSize--small)", description: "Small font" },
        { name: "--vuiii-input-height--large", value: "var(--vuiii-field-height--large)", description: "Large height" },
        { name: "--vuiii-input-fontSize--large", value: "var(--vuiii-field-fontSize--large)", description: "Large font" },
      ];
      return { baseTokens, sizeTokens };
    },
  }),
};

export const Components: StoryObj = {
  render: () => ({
    components: { TokenDocs, TokenTable },
    template: `
      <TokenDocs title="Component Tokens">
        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Divider</h2>
          <TokenTable :tokens="dividerTokens" />
          <div style="padding: 1rem 0;">
            <div style="border-bottom: var(--vuiii-divider-width) solid var(--vuiii-divider-color); margin: var(--vuiii-divider-margin) 0;"></div>
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Checkbox</h2>
          <TokenTable :tokens="checkboxTokens" />
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <div style="width: 1.5rem; height: 1.5rem; background: var(--vuiii-checkbox-bgColor--checked); border-radius: 0.25rem; display: flex; align-items: center; justify-content: center;">
              <span style="color: var(--vuiii-checkbox-iconColor--checked);">✓</span>
            </div>
            <span>Checked state colors</span>
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Icon Sizes</h2>
          <TokenTable :tokens="iconTokens" />
          <div style="display: flex; align-items: center; gap: 2rem; margin-top: 1rem;">
            <div style="text-align: center;">
              <div style="width: var(--vuiii-icon-size--small); height: var(--vuiii-icon-size--small); background: var(--vuiii-color-gray--dark); border-radius: 0.25rem;"></div>
              <code style="font-size: 0.7rem;">small</code>
            </div>
            <div style="text-align: center;">
              <div style="width: var(--vuiii-icon-size); height: var(--vuiii-icon-size); background: var(--vuiii-color-gray--dark); border-radius: 0.25rem;"></div>
              <code style="font-size: 0.7rem;">normal</code>
            </div>
            <div style="text-align: center;">
              <div style="width: var(--vuiii-icon-size--large); height: var(--vuiii-icon-size--large); background: var(--vuiii-color-gray--dark); border-radius: 0.25rem;"></div>
              <code style="font-size: 0.7rem;">large</code>
            </div>
          </div>
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Table</h2>
          <TokenTable :tokens="tableTokens" />
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Dialog</h2>
          <TokenTable :tokens="dialogTokens" />
        </section>

        <section style="margin-bottom: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Dropdown Menu</h2>
          <TokenTable :tokens="dropdownTokens" />
        </section>
      </TokenDocs>
    `,
    setup() {
      const dividerTokens = [
        { name: "--vuiii-divider-color", value: "var(--vuiii-color-gray--light)", description: "Line color" },
        { name: "--vuiii-divider-width", value: "1px", description: "Line thickness" },
        { name: "--vuiii-divider-margin", value: "1rem", description: "Vertical spacing" },
      ];
      const checkboxTokens = [
        { name: "--vuiii-checkbox-bgColor--checked", value: "var(--vuiii-color-primary)", description: "Checked background" },
        { name: "--vuiii-checkbox-borderColor--checked", value: "var(--vuiii-checkbox-bgColor--checked)", description: "Checked border" },
        { name: "--vuiii-checkbox-iconColor--checked", value: "var(--vuiii-color-white)", description: "Checkmark color" },
      ];
      const iconTokens = [
        { name: "--vuiii-icon-size--small", value: "1.1rem", description: "Small icon size" },
        { name: "--vuiii-icon-size", value: "1.3rem", description: "Default icon size" },
        { name: "--vuiii-icon-size--large", value: "1.75rem", description: "Large icon size" },
      ];
      const tableTokens = [
        { name: "--vuiii-table-fontSize", value: "var(--vuiii-fontSize)", description: "Table text size" },
        { name: "--vuiii-table-dividerColor", value: "var(--vuiii-divider-color)", description: "Row divider color" },
        { name: "--vuiii-table-dividerWidth", value: "var(--vuiii-divider-width)", description: "Row divider width" },
        { name: "--vuiii-table-headBgColor", value: "transparent", description: "Header background" },
        { name: "--vuiii-table-headTextColor", value: "var(--vuiii-color-gray--dark)", description: "Header text color" },
        { name: "--vuiii-table-rowBgColor", value: "transparent", description: "Row background" },
        { name: "--vuiii-table-rowBgColor--hover", value: "color-mix(...)", description: "Row hover background" },
      ];
      const dialogTokens = [
        { name: "--vuiii-dialog-title-fontSize", value: "var(--vuiii-fontSize--x-large)", description: "Title font size" },
        { name: "--vuiii-dialog-bgColor", value: "var(--vuiii-color-light)", description: "Dialog background" },
        { name: "--vuiii-dialog-textColor", value: "var(--vuiii-color-dark)", description: "Dialog text color" },
        { name: "--vuiii-dialog-borderRadius", value: "var(--vuiii-button-borderRadius)", description: "Corner radius" },
        { name: "--vuiii-dialog-padding", value: "1.5rem", description: "Content padding" },
        { name: "--vuiii-dialog-boxShadow", value: "0 2px 10px rgb(0 0 0 / 0.1)", description: "Drop shadow" },
        { name: "--vuiii-dialog-backdropBgColor", value: "rgb(0 0 0 / 0.35)", description: "Overlay color" },
      ];
      const dropdownTokens = [
        { name: "--vuiii-dropdownMenu-bgColor", value: "var(--vuiii-field-bgColor)", description: "Menu background" },
        { name: "--vuiii-dropdownMenu-textColor", value: "var(--vuiii-field-textColor)", description: "Menu text color" },
        { name: "--vuiii-dropdownMenu-borderRadius", value: "var(--vuiii-field-borderRadius)", description: "Corner radius" },
        { name: "--vuiii-dropdownMenu-boxShadow", value: "var(--vuiii-shadow--large)", description: "Drop shadow" },
        { name: "--vuiii-dropdownMenu-cursor-bgColor", value: "color-mix(...)", description: "Cursor highlight" },
        { name: "--vuiii-dropdownMenu-button-bgColor--hover", value: "color-mix(...)", description: "Item hover" },
      ];
      return { dividerTokens, checkboxTokens, iconTokens, tableTokens, dialogTokens, dropdownTokens };
    },
  }),
};

export const ZIndex: StoryObj = {
  render: () => ({
    components: { TokenDocs, TokenTable },
    template: `
      <TokenDocs title="Z-Index Layers">
        <p style="line-height: 1.6; color: #666; margin-bottom: 1.5rem;">
          Z-index tokens define the stacking order for overlays, modals, and floating elements.
        </p>

        <TokenTable :tokens="zIndexTokens" />

        <section style="margin-top: 2rem;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">Visual Layer Stack</h2>
          <div style="position: relative; height: 300px; background: #f5f5f5; border-radius: 0.5rem; overflow: hidden;">
            <div style="position: absolute; bottom: 20px; left: 20px; right: 20px; height: 40px; background: var(--vuiii-color-gray--light); border-radius: 0.25rem; display: flex; align-items: center; justify-content: center; z-index: var(--vuiii-zIndex-header);">
              <code>header (z-index: 10)</code>
            </div>
            <div style="position: absolute; bottom: 80px; left: 40px; width: 200px; height: 150px; background: white; border-radius: 0.5rem; box-shadow: var(--vuiii-shadow--large); display: flex; align-items: center; justify-content: center; z-index: var(--vuiii-zIndex-dialog);">
              <code style="font-size: 0.8rem;">dialog (1000)</code>
            </div>
            <div style="position: absolute; bottom: 100px; left: 180px; width: 150px; height: 120px; background: white; border-radius: 0.5rem; box-shadow: var(--vuiii-shadow--large); display: flex; align-items: center; justify-content: center; z-index: var(--vuiii-zIndex-dropdown);">
              <code style="font-size: 0.8rem;">dropdown (1010)</code>
            </div>
            <div style="position: absolute; bottom: 140px; left: 280px; padding: 0.5rem 1rem; background: var(--vuiii-color-gray--darkest); color: white; border-radius: 0.25rem; z-index: var(--vuiii-zIndex-tooltip);">
              <code style="font-size: 0.8rem;">tooltip (1020)</code>
            </div>
            <div style="position: absolute; top: 20px; right: 20px; padding: 0.75rem 1rem; background: var(--vuiii-color-success); color: white; border-radius: 0.25rem; z-index: var(--vuiii-zIndex-snackbar);">
              <code style="font-size: 0.8rem;">snackbar (1030)</code>
            </div>
          </div>
        </section>
      </TokenDocs>
    `,
    setup() {
      const zIndexTokens = [
        { name: "--vuiii-zIndex-header", value: "10", description: "Fixed headers and navbars" },
        { name: "--vuiii-zIndex-dialog", value: "1000", description: "Modal dialogs" },
        { name: "--vuiii-zIndex-dropdown", value: "1010", description: "Dropdown menus" },
        { name: "--vuiii-zIndex-tooltip", value: "1020", description: "Tooltips" },
        { name: "--vuiii-zIndex-snackbar", value: "1030", description: "Toast notifications" },
      ];
      return { zIndexTokens };
    },
  }),
};

export const AllTokens: StoryObj = {
  render: () => ({
    components: { TokenDocs },
    template: `
      <TokenDocs title="All CSS Variables Reference">
        <p style="line-height: 1.6; color: #666; margin-bottom: 1.5rem;">
          Complete reference of all {{ tokens.length }} CSS custom properties defined in <code>common.css</code>.
        </p>

        <div style="margin-bottom: 1rem;">
          <input
            v-model="search"
            type="text"
            placeholder="Filter tokens..."
            style="width: 100%; max-width: 400px; padding: 0.5rem 1rem; border: 1px solid var(--vuiii-color-gray); border-radius: 0.25rem; font-size: 0.9rem;"
          />
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
          <thead>
            <tr style="border-bottom: 2px solid #e5e5e5; text-align: left; position: sticky; top: 0; background: white;">
              <th style="padding: 0.75rem; font-weight: 600;">Token</th>
              <th style="padding: 0.75rem; font-weight: 600;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="token in filteredTokens" :key="token.name" style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 0.5rem 0.75rem;"><code>{{ token.name }}</code></td>
              <td style="padding: 0.5rem 0.75rem; font-family: monospace; color: #666; word-break: break-all;">{{ token.value }}</td>
            </tr>
          </tbody>
        </table>
      </TokenDocs>
    `,
    setup() {
      const { ref, computed } = require("vue");
      const search = ref("");

      const tokens = [
        // Colors
        { name: "--vuiii-color-white", value: "white" },
        { name: "--vuiii-color-black", value: "black" },
        { name: "--vuiii-color-light", value: "var(--vuiii-color-white)" },
        { name: "--vuiii-color-dark", value: "var(--vuiii-color-black)" },
        { name: "--vuiii-color-gray", value: "rgb(212 212 216)" },
        { name: "--vuiii-color-gray--light", value: "rgb(229 229 229)" },
        { name: "--vuiii-color-gray--lighter", value: "rgb(245 245 245)" },
        { name: "--vuiii-color-gray--lightest", value: "rgb(250 250 250)" },
        { name: "--vuiii-color-gray--dark", value: "rgb(163 163 163)" },
        { name: "--vuiii-color-gray--darker", value: "rgb(115 115 115)" },
        { name: "--vuiii-color-gray--darkest", value: "rgb(82 82 82)" },
        { name: "--vuiii-color-primary", value: "rgb(79 70 229)" },
        { name: "--vuiii-color-primary--darker", value: "color-mix(in srgb, var(--vuiii-color-primary) 95%, black)" },
        { name: "--vuiii-color-primary--darkest", value: "color-mix(in srgb, var(--vuiii-color-primary) 85%, black)" },
        { name: "--vuiii-color-danger", value: "rgb(225 29 72)" },
        { name: "--vuiii-color-danger--darker", value: "color-mix(in srgb, var(--vuiii-color-danger) 95%, black)" },
        { name: "--ui-color-warning", value: "rgb(234, 179, 8)" },
        { name: "--ui-color-warning--darker", value: "color-mix(in srgb, var(--ui-color-warning) 95%, black)" },
        { name: "--vuiii-color-success", value: "rgb(77 124 15)" },
        { name: "--vuiii-color-success--darker", value: "color-mix(in srgb, var(--vuiii-color-success) 95%, black)" },
        { name: "--vuiii-shadow", value: "0 1px 3px 0 rgb(0 0 0/0.1), 0 1px 2px -1px rgb(0 0 0/0.1)" },
        { name: "--vuiii-shadow--large", value: "0 2px 15px 0 rgb(0 0 0/0.2), 0 1px 2px -1px rgb(0 0 0/0.1)" },
        // Typography
        { name: "--vuiii-typeface-body", value: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif' },
        { name: "--vuiii-typeface-display", value: "var(--vuiii-typeface-body)" },
        { name: "--vuiii-fontSize", value: "1rem" },
        { name: "--vuiii-fontSize--tiny", value: "calc(var(--vuiii-fontSize) * 0.75)" },
        { name: "--vuiii-fontSize--small", value: "calc(var(--vuiii-fontSize) * 0.85)" },
        { name: "--vuiii-fontSize--large", value: "calc(var(--vuiii-fontSize) * 1.25)" },
        { name: "--vuiii-fontSize--x-large", value: "calc(var(--vuiii-fontSize) * 1.5)" },
        { name: "--vuiii-fontSize--2x-large", value: "calc(var(--vuiii-fontSize) * 2)" },
        { name: "--vuiii-fontSize--3x-large", value: "calc(var(--vuiii-fontSize) * 3)" },
        { name: "--vuiii-fontSize--4x-large", value: "calc(var(--vuiii-fontSize) * 4)" },
        // Typography variants (display)
        { name: "--vuiii-typography-display-fontSize", value: "var(--vuiii-fontSize--4x-large)" },
        { name: "--vuiii-typography-display-fontWeight", value: "600" },
        { name: "--vuiii-typography-display-lineHeight", value: "1.2" },
        { name: "--vuiii-typography-display-textTransform", value: "none" },
        { name: "--vuiii-typography-display-color", value: "inherit" },
        { name: "--vuiii-typography-display-opacity", value: "1" },
        // Typography variants (heading1-6, body1-2, label, caption, description)
        { name: "--vuiii-typography-heading1-fontSize", value: "var(--vuiii-fontSize--2x-large)" },
        { name: "--vuiii-typography-heading1-fontWeight", value: "600" },
        { name: "--vuiii-typography-heading2-fontSize", value: "var(--vuiii-fontSize--large)" },
        { name: "--vuiii-typography-heading2-fontWeight", value: "600" },
        { name: "--vuiii-typography-heading3-fontSize", value: "var(--vuiii-fontSize)" },
        { name: "--vuiii-typography-heading3-fontWeight", value: "600" },
        { name: "--vuiii-typography-body1-fontSize", value: "var(--vuiii-fontSize)" },
        { name: "--vuiii-typography-body1-fontWeight", value: "400" },
        { name: "--vuiii-typography-body2-fontSize", value: "var(--vuiii-fontSize)" },
        { name: "--vuiii-typography-body2-opacity", value: "0.65" },
        { name: "--vuiii-typography-label-fontSize", value: "var(--vuiii-fontSize--small)" },
        { name: "--vuiii-typography-label-fontWeight", value: "600" },
        { name: "--vuiii-typography-caption-fontSize", value: "var(--vuiii-fontSize--tiny)" },
        { name: "--vuiii-typography-caption-textTransform", value: "uppercase" },
        { name: "--vuiii-typography-description-fontSize", value: "var(--vuiii-fontSize--tiny)" },
        { name: "--vuiii-typography-description-opacity", value: "0.65" },
        // Fields
        { name: "--vuiii-field-height", value: "2.5em" },
        { name: "--vuiii-field-padding", value: "1.35em" },
        { name: "--vuiii-field-borderRadius", value: "0.25em" },
        { name: "--vuiii-field-fontSize", value: "var(--vuiii-fontSize)" },
        { name: "--vuiii-field-borderWidth", value: "1px" },
        { name: "--vuiii-field-bgColor", value: "var(--vuiii-color-white)" },
        { name: "--vuiii-field-borderColor", value: "var(--vuiii-color-gray)" },
        { name: "--vuiii-field-ringColor", value: "color-mix(in srgb, var(--vuiii-color-gray--dark) 10%, transparent)" },
        { name: "--vuiii-field-ringSize", value: "0.25em" },
        { name: "--vuiii-field-borderColor--active", value: "var(--vuiii-color-gray--dark)" },
        { name: "--vuiii-field-borderColor--focus", value: "var(--vuiii-color-gray--dark)" },
        { name: "--vuiii-field-borderColor--invalid", value: "var(--vuiii-color-danger)" },
        { name: "--vuiii-field-transition", value: "all 0.05s ease-in-out" },
        { name: "--vuiii-field-opacity--disabled", value: "0.6" },
        // Buttons
        { name: "--vuiii-button-fontSize", value: "var(--vuiii-field-fontSize)" },
        { name: "--vuiii-button-fontFamily", value: "var(--vuiii-typeface-body)" },
        { name: "--vuiii-button-fontWeight", value: "normal" },
        { name: "--vuiii-button-height", value: "var(--vuiii-field-height)" },
        { name: "--vuiii-button-padding", value: "var(--vuiii-field-padding)" },
        { name: "--vuiii-button-borderRadius", value: "var(--vuiii-field-borderRadius)" },
        { name: "--vuiii-button-bgColor", value: "transparent" },
        { name: "--vuiii-button-textColor", value: "var(--vuiii-color-primary)" },
        { name: "--vuiii-button-bgColor--primary", value: "var(--vuiii-color-primary)" },
        { name: "--vuiii-button-textColor--primary", value: "white" },
        { name: "--vuiii-button-bgColor--secondary", value: "var(--vuiii-color-gray--light)" },
        { name: "--vuiii-button-textColor--secondary", value: "var(--vuiii-color-gray--darkest)" },
        { name: "--vuiii-button-bgColor--danger", value: "var(--vuiii-color-danger)" },
        { name: "--vuiii-button-textColor--danger", value: "white" },
        { name: "--vuiii-button-bgColor--success", value: "var(--vuiii-color-success)" },
        { name: "--vuiii-button-textColor--success", value: "white" },
        // Inputs
        { name: "--vuiii-input-height", value: "var(--vuiii-field-height)" },
        { name: "--vuiii-input-padding", value: "var(--vuiii-field-padding)" },
        { name: "--vuiii-input-fontSize", value: "var(--vuiii-field-fontSize)" },
        { name: "--vuiii-input-borderRadius", value: "var(--vuiii-field-borderRadius)" },
        { name: "--vuiii-input-textColor", value: "inherit" },
        { name: "--vuiii-input-borderColor", value: "var(--vuiii-field-borderColor)" },
        { name: "--vuiii-input-bgColor", value: "var(--vuiii-color-white)" },
        { name: "--vuiii-input-placeholderColor", value: "color-mix(in srgb, currentColor 50%, transparent)" },
        { name: "--vuiii-input-iconColor", value: "color-mix(in srgb, currentColor 50%, transparent)" },
        { name: "--vuiii-input-borderColor--valid", value: "var(--vuiii-color-success)" },
        { name: "--vuiii-input-borderColor--invalid", value: "var(--vuiii-color-danger)" },
        // Divider
        { name: "--vuiii-divider-color", value: "var(--vuiii-color-gray--light)" },
        { name: "--vuiii-divider-width", value: "1px" },
        { name: "--vuiii-divider-margin", value: "1rem" },
        // Checkbox
        { name: "--vuiii-checkbox-bgColor--checked", value: "var(--vuiii-color-primary)" },
        { name: "--vuiii-checkbox-borderColor--checked", value: "var(--vuiii-checkbox-bgColor--checked)" },
        { name: "--vuiii-checkbox-iconColor--checked", value: "var(--vuiii-color-white)" },
        // Icons
        { name: "--vuiii-icon-size--small", value: "1.1rem" },
        { name: "--vuiii-icon-size", value: "1.3rem" },
        { name: "--vuiii-icon-size--large", value: "1.75rem" },
        // Table
        { name: "--vuiii-table-fontSize", value: "var(--vuiii-fontSize)" },
        { name: "--vuiii-table-dividerColor", value: "var(--vuiii-divider-color)" },
        { name: "--vuiii-table-headBgColor", value: "transparent" },
        { name: "--vuiii-table-headTextColor", value: "var(--vuiii-color-gray--dark)" },
        { name: "--vuiii-table-rowBgColor", value: "transparent" },
        { name: "--vuiii-table-rowBgColor--hover", value: "color-mix(in srgb, var(--vuiii-color-dark) 4%, transparent)" },
        // Dialog
        { name: "--vuiii-dialog-title-fontSize", value: "var(--vuiii-fontSize--x-large)" },
        { name: "--vuiii-dialog-bgColor", value: "var(--vuiii-color-light)" },
        { name: "--vuiii-dialog-textColor", value: "var(--vuiii-color-dark)" },
        { name: "--vuiii-dialog-borderRadius", value: "var(--vuiii-button-borderRadius)" },
        { name: "--vuiii-dialog-padding", value: "1.5rem" },
        { name: "--vuiii-dialog-boxShadow", value: "0 2px 10px rgb(0 0 0 / 0.1)" },
        { name: "--vuiii-dialog-backdropBgColor", value: "rgb(0 0 0 / 0.35)" },
        // Dropdown Menu
        { name: "--vuiii-dropdownMenu-bgColor", value: "var(--vuiii-field-bgColor)" },
        { name: "--vuiii-dropdownMenu-borderRadius", value: "var(--vuiii-field-borderRadius)" },
        { name: "--vuiii-dropdownMenu-boxShadow", value: "var(--vuiii-shadow--large)" },
        { name: "--vuiii-dropdownMenu-cursor-bgColor", value: "color-mix(in srgb, var(--vuiii-color-black) 6%, transparent)" },
        // Z-Index
        { name: "--vuiii-zIndex-header", value: "10" },
        { name: "--vuiii-zIndex-dialog", value: "1000" },
        { name: "--vuiii-zIndex-dropdown", value: "1010" },
        { name: "--vuiii-zIndex-tooltip", value: "1020" },
        { name: "--vuiii-zIndex-snackbar", value: "1030" },
      ];

      const filteredTokens = computed(() => {
        if (!search.value) return tokens;
        const query = search.value.toLowerCase();
        return tokens.filter(
          (t) => t.name.toLowerCase().includes(query) || t.value.toLowerCase().includes(query)
        );
      });

      return { tokens, search, filteredTokens };
    },
  }),
};
