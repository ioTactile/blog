<template>
  <div>
    <v-toolbar height="48" color="white" border class="tiptap-toolbar">
      <v-btn
        variant="flat"
        :disabled="!editor?.can().undo()"
        @click="editor?.chain().focus().undo().run()"
      >
        <v-icon :icon="mdiUndo" />
      </v-btn>
      <v-btn
        variant="flat"
        :disabled="!editor?.can().redo()"
        @click="editor?.chain().focus().redo().run()"
      >
        <v-icon :icon="mdiRedo" />
      </v-btn>

      <v-btn
        variant="flat"
        :active="editor?.isActive('bold')"
        @click="editor?.chain().focus().toggleBold().run()"
      >
        <v-icon :icon="mdiFormatBold" />
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('italic')"
        @click="editor?.chain().focus().toggleItalic().run()"
      >
        <v-icon :icon="mdiFormatItalic" />
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('underline')"
        @click="editor?.chain().focus().toggleUnderline().run()"
      >
        <v-icon :icon="mdiFormatUnderline" />
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('strike')"
        @click="editor?.chain().focus().toggleStrike().run()"
      >
        <v-icon :icon="mdiFormatStrikethrough" />
      </v-btn>
      <v-btn
        variant="flat"
        class="px-0 full-height-content"
        :active="editor?.isActive('textStyle', { color })"
        @click="editor?.chain().focus().setColor(color).run()"
      >
        <v-icon
          :icon="mdiFormatColorText"
          size="x-large"
          class="mx-4"
          :style="{ color }"
        />
        <v-divider vertical />
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="px-0 h-100 custom-min-width"
              variant="flat"
            >
              <v-icon :icon="mdiArrowDownDropCircle" size="small" />
            </v-btn>
          </template>
          <v-color-picker v-model="color" show-swatches />
        </v-menu>
      </v-btn>
      <v-btn
        variant="flat"
        class="px-0 full-height-content"
        :active="editor?.isActive('highlight')"
        @click="
          editor
            ?.chain()
            .focus()
            .toggleHighlight({ color: backgroundColor })
            .run()
        "
      >
        <div class="d-flex align-center flex-column justify-center">
          <v-icon :icon="mdiFormatColorHighlight" size="x-large" class="mx-4" />
          <v-sheet tile height="4" width="26" :color="backgroundColor" />
        </div>
        <v-divider vertical />
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="px-0 h-100 custom-min-width"
              variant="flat"
            >
              <v-icon :icon="mdiArrowDownDropCircle" size="small" />
            </v-btn>
          </template>
          <v-color-picker v-model="backgroundColor" show-swatches />
        </v-menu>
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('subscript')"
        @click="editor?.chain().focus().toggleSubscript().run()"
      >
        <v-icon :icon="mdiFormatSubscript" />
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('superscript')"
        @click="editor?.chain().focus().toggleSuperscript().run()"
      >
        <v-icon :icon="mdiFormatSuperscript" />
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('blockquote')"
        @click="editor?.chain().focus().toggleBlockquote().run()"
      >
        <v-icon :icon="mdiFormatQuoteOpen" />
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('bulletList')"
        @click="editor?.chain().focus().toggleBulletList().run()"
      >
        <v-icon :icon="mdiFormatListBulleted" />
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('orderedList')"
        @click="editor?.chain().focus().toggleOrderedList().run()"
      >
        <v-icon :icon="mdiFormatListNumbered" />
      </v-btn>
      <v-btn
        variant="flat"
        :active="editor?.isActive('taskList')"
        @click="editor?.chain().focus().toggleTaskList().run()"
      >
        <v-icon :icon="mdiFormatListCheckbox" />
      </v-btn>
      <v-btn
        variant="flat"
        :disabled="!editor?.can().sinkListItem('listItem')"
        @click="editor?.chain().focus().sinkListItem('listItem').run()"
      >
        <v-icon :icon="mdiFormatIndentIncrease" />
      </v-btn>
      <v-btn
        variant="flat"
        :disabled="!editor?.can().liftListItem('listItem')"
        @click="editor?.chain().focus().liftListItem('listItem').run()"
      >
        <v-icon :icon="mdiFormatIndentDecrease" />
      </v-btn>
      <v-btn
        variant="flat"
        @click="editor?.chain().focus().setHorizontalRule().run()"
      >
        _
      </v-btn>
      <v-btn
        variant="flat"
        @click="editor?.chain().focus().setHardBreak().run()"
      >
        Space
      </v-btn>

      <v-btn
        variant="flat"
        :disabled="!editor?.isActive('link')"
        @click="editor?.chain().focus().unsetLink().run()"
      >
        <v-icon :icon="mdiLinkOff" />
      </v-btn>
      <v-menu :close-on-content-click="false" width="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="flat">
            <v-icon :icon="mdiLink" size="large" />
          </v-btn>
        </template>
        <div class="bg-white pa-6">
          <v-form
            @submit.prevent="
              editor
                ?.chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: link, target: '_blank' })
                .run()
            "
          >
            <v-text-field v-model="link" label="Lien" variant="outlined" />
            <div class="text-right">
              <v-btn type="submit" color="primary"> Valider </v-btn>
            </div>
          </v-form>
        </div>
      </v-menu>
      <v-menu :close-on-content-click="false" width="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="flat">
            <v-icon :icon="mdiImage" size="large" />
          </v-btn>
        </template>
        <div class="bg-white pa-6">
          <v-form
            @submit.prevent="
              editor?.chain().focus().setImage({ src: imageLink }).run()
            "
          >
            <v-text-field v-model="imageLink" label="Lien" variant="outlined" />
            <div class="text-right">
              <v-btn type="submit" color="primary"> Valider </v-btn>
            </div>
          </v-form>
        </div>
      </v-menu>
      <v-menu :close-on-content-click="false" width="300">
        <template #activator="{ props }">
          <v-btn v-bind="props" variant="flat">
            <v-icon :icon="mdiVideo" size="large" />
          </v-btn>
        </template>
        <div class="bg-white pa-6">
          <v-form
            @submit.prevent="
              editor?.commands.setYoutubeVideo({ src: videoLink })
            "
          >
            <v-text-field
              v-model="videoLink"
              label="Lien Youtube"
              variant="outlined"
            />
            <div class="text-right">
              <v-btn type="submit" color="primary"> Valider </v-btn>
            </div>
          </v-form>
        </div>
      </v-menu>

      <v-btn-toggle divided>
        <v-btn
          :icon="mdiFormatHeader2"
          :active="editor?.isActive('heading', { level: 2 })"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        />
        <v-btn
          :icon="mdiFormatHeader3"
          :active="editor?.isActive('heading', { level: 3 })"
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        />
        <v-btn
          :icon="mdiFormatHeader4"
          :active="editor?.isActive('heading', { level: 4 })"
          @click="editor?.chain().focus().toggleHeading({ level: 4 }).run()"
        />
        <v-btn
          :icon="mdiFormatHeader5"
          :active="editor?.isActive('heading', { level: 5 })"
          @click="editor?.chain().focus().toggleHeading({ level: 5 }).run()"
        />
        <v-btn
          :icon="mdiFormatHeader6"
          :active="editor?.isActive('heading', { level: 6 })"
          @click="editor?.chain().focus().toggleHeading({ level: 6 }).run()"
        />
      </v-btn-toggle>

      <v-btn-toggle
        mandatory
        divided
        @update:model-value="editor?.chain().focus().setTextAlign($event).run()"
      >
        <v-btn
          :active="editor?.isActive({ textAlign: 'left' })"
          :icon="mdiFormatAlignLeft"
          value="left"
        />
        <v-btn
          :active="editor?.isActive({ textAlign: 'center' })"
          :icon="mdiFormatAlignCenter"
          value="center"
        />
        <v-btn
          :active="editor?.isActive({ textAlign: 'right' })"
          :icon="mdiFormatAlignRight"
          value="right"
        />
        <v-btn
          :active="editor?.isActive({ textAlign: 'justify' })"
          :icon="mdiFormatAlignJustify"
          value="justify"
        />
      </v-btn-toggle>

      <div>
        <v-btn
          variant="flat"
          @click="
            editor?.commands.insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true
            })
          "
        >
          <v-icon :icon="mdiTablePlus" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().addColumnBefore().run()"
        >
          <v-icon :icon="mdiTableColumnPlusBefore" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().addColumnAfter().run()"
        >
          <v-icon :icon="mdiTableColumnPlusAfter" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().deleteColumn().run()"
        >
          <v-icon :icon="mdiTableColumnRemove" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().addRowBefore().run()"
        >
          <v-icon :icon="mdiTableRowPlusBefore" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().addRowAfter().run()"
        >
          <v-icon :icon="mdiTableRowPlusAfter" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().deleteRow().run()"
        >
          <v-icon :icon="mdiTableRowRemove" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().mergeCells().run()"
        >
          <v-icon :icon="mdiTableMergeCells" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().splitCell().run()"
        >
          <v-icon :icon="mdiTableSplitCell" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().toggleHeaderCell().run()"
        >
          <v-icon :icon="mdiTableBorder" />
        </v-btn>
        <v-btn
          variant="flat"
          :disabled="!editor?.isActive('table')"
          @click="editor?.chain().focus().deleteTable().run()"
        >
          <v-icon :icon="mdiTableOff" />
        </v-btn>
      </div>
    </v-toolbar>

    <v-sheet border class="container-editor">
      <EditorContent :editor="editor" />
    </v-sheet>
  </div>
</template>

<script lang="ts" setup>
import {
  VBtn,
  VSheet,
  VIcon,
  VToolbar,
  VBtnToggle,
  VMenu,
  VTextField,
  VForm,
  VColorPicker,
  VDivider
} from 'vuetify/components'
import {
  mdiArrowDownDropCircle,
  mdiFormatAlignCenter,
  mdiFormatAlignJustify,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatBold,
  mdiFormatColorHighlight,
  mdiFormatColorText,
  mdiFormatHeader2,
  mdiFormatHeader3,
  mdiFormatHeader4,
  mdiFormatHeader5,
  mdiFormatHeader6,
  mdiFormatIndentDecrease,
  mdiFormatIndentIncrease,
  mdiFormatItalic,
  mdiFormatListBulleted,
  mdiFormatListCheckbox,
  mdiFormatListNumbered,
  mdiFormatQuoteOpen,
  mdiFormatStrikethrough,
  mdiFormatSubscript,
  mdiFormatSuperscript,
  mdiFormatUnderline,
  mdiImage,
  mdiLink,
  mdiLinkOff,
  mdiRedo,
  mdiTableBorder,
  mdiTableColumnPlusAfter,
  mdiTableColumnPlusBefore,
  mdiTableColumnRemove,
  mdiTableMergeCells,
  mdiTableOff,
  mdiTablePlus,
  mdiTableRowPlusAfter,
  mdiTableRowPlusBefore,
  mdiTableRowRemove,
  mdiTableSplitCell,
  mdiUndo,
  mdiVideo
} from '@mdi/js'
import { useEditor, EditorContent } from '@tiptap/vue-3'
// eslint-disable-next-line import/no-named-as-default
import StarterKit from '@tiptap/starter-kit'
// eslint-disable-next-line import/no-named-as-default
import Underline from '@tiptap/extension-underline'
// eslint-disable-next-line import/no-named-as-default
import HardBreak from '@tiptap/extension-hard-break'
// eslint-disable-next-line import/no-named-as-default
import Highlight from '@tiptap/extension-highlight'
// eslint-disable-next-line import/no-named-as-default
import TextStyle from '@tiptap/extension-text-style'
// eslint-disable-next-line import/no-named-as-default
import Color from '@tiptap/extension-color'
// eslint-disable-next-line import/no-named-as-default
import Subscript from '@tiptap/extension-subscript'
// eslint-disable-next-line import/no-named-as-default
import Superscript from '@tiptap/extension-superscript'
// eslint-disable-next-line import/no-named-as-default
import TextAlign from '@tiptap/extension-text-align'
// eslint-disable-next-line import/no-named-as-default
import Link from '@tiptap/extension-link'
// eslint-disable-next-line import/no-named-as-default
import Image from '@tiptap/extension-image'
// eslint-disable-next-line import/no-named-as-default
import TaskItem from '@tiptap/extension-task-item'
// eslint-disable-next-line import/no-named-as-default
import TaskList from '@tiptap/extension-task-list'
// eslint-disable-next-line import/no-named-as-default
import Youtube from '@tiptap/extension-youtube'
// eslint-disable-next-line import/no-named-as-default
import Table from '@tiptap/extension-table'
// eslint-disable-next-line import/no-named-as-default
import TableCell from '@tiptap/extension-table-cell'
// eslint-disable-next-line import/no-named-as-default
import TableHeader from '@tiptap/extension-table-header'
// eslint-disable-next-line import/no-named-as-default
import TableRow from '@tiptap/extension-table-row'

const componentProps = defineProps<{ modelValue?: string }>()
const emits = defineEmits<{
  (e: 'update:model-value', newVal?: string): void
}>()

const editor = useEditor({
  content: componentProps.modelValue,
  extensions: [
    StarterKit.configure({ heading: { levels: [2, 3, 4, 5, 6] } }),
    Underline,
    Highlight.configure({ multicolor: true }),
    HardBreak,
    TextStyle,
    Color.configure({ types: ['textStyle'] }),
    Subscript,
    Superscript,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({ protocols: ['mailto'] }),
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        style: 'max-width: 100%; height: auto;'
      }
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Youtube.configure({ modestBranding: true }),
    Table.configure({ resizable: true }),
    TableCell,
    TableHeader,
    TableRow
  ],
  onUpdate: () => emits('update:model-value', editor.value?.getHTML())
})

const color = ref('#000000')
const backgroundColor = ref('#CCA66C')
const link = ref('')
const imageLink = ref('')
const videoLink = ref('')

watch(
  () => componentProps.modelValue,
  (value) => {
    const isSame = editor.value?.getHTML() === value
    if (isSame || !value) {
      return
    }
    editor.value?.commands.setContent(value, false)
  }
)

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style lang="scss">
.ProseMirror {
  padding: 24px;
}

.container-editor {
  img {
    max-width: 100%;
    height: auto;
  }
}

.full-height-content {
  .v-btn__content {
    height: 100%;
  }
}
.custom-min-width {
  min-width: 23px;
}

.tiptap-toolbar {
  .v-toolbar__content {
    flex-wrap: wrap;
    height: auto !important;
  }
}
</style>
