import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import FontFamily from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const fonts = [
        { label: 'Sistema', value: '' },
        { label: 'Merriweather', value: 'Merriweather' },
        { label: 'Lora', value: 'Lora' },
        { label: 'Playfair', value: 'Playfair Display' },
        { label: 'Inter', value: 'Inter' },
        { label: 'Montserrat', value: 'Montserrat' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Mono', value: 'Courier Prime' },
        { label: 'Fira', value: 'Fira Code' },
        { label: 'Caveat', value: 'Caveat' },
        { label: 'Dancing', value: 'Dancing Script' },
    ];

    const buttons = [
        { label: 'B', action: () => editor.chain().focus().toggleBold().run(), active: 'bold', title: 'Negrita' },
        { label: 'I', action: () => editor.chain().focus().toggleItalic().run(), active: 'italic', title: 'Cursiva' },
        { label: 'U', action: () => editor.chain().focus().toggleUnderline().run(), active: 'underline', title: 'Subrayado' },
        { label: 'S', action: () => editor.chain().focus().toggleStrike().run(), active: 'strike', title: 'Tachado' },
        { label: 'H1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: 'heading', params: { level: 1 }, title: 'Título 1' },
        { label: 'H2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: 'heading', params: { level: 2 }, title: 'Título 2' },
        { label: '•', action: () => editor.chain().focus().toggleBulletList().run(), active: 'bulletList', title: 'Lista de puntos' },
        { label: '1.', action: () => editor.chain().focus().toggleOrderedList().run(), active: 'orderedList', title: 'Lista numerada' },
        { label: '“', action: () => editor.chain().focus().toggleBlockquote().run(), active: 'blockquote', title: 'Cita' },
        { label: '↩', action: () => editor.chain().focus().undo().run(), title: 'Deshacer' },
        { label: '↪', action: () => editor.chain().focus().redo().run(), title: 'Rehacer' },
    ];

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-white/5 backdrop-blur-sm rounded-t-xl">
            <select
                onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
                className="bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/20 outline-none focus:ring-1 focus:ring-pink-500 mr-2"
                value={editor.getAttributes('textStyle').fontFamily || ''}
            >
                {fonts.map((font) => (
                    <option key={font.value} value={font.value} className="bg-slate-800 text-white">
                        {font.label}
                    </option>
                ))}
            </select>

            <div className="h-6 w-px bg-white/10 mx-1"></div>

            {buttons.map((btn, i) => (
                <button
                    key={i}
                    onClick={btn.action}
                    type="button"
                    title={btn.title}
                    className={`px-3 py-1 rounded transition-colors text-sm font-medium ${btn.active && editor.isActive(btn.active, btn.params)
                        ? 'bg-pink-500 text-white'
                        : 'text-purple-200 hover:bg-white/10'
                        }`}
                >
                    {btn.label}
                </button>
            ))}
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder, className = '' }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            FontFamily,
            CharacterCount.configure({
                limit: null,
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 text-purple-50 placeholder:text-purple-300/50',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    return (
        <div className={`flex flex-col border border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-md ${className}`}>
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto bg-transparent">
                <EditorContent editor={editor} />
            </div>
            {editor && (
                <div className="p-2 border-t border-white/10 text-right text-xs text-purple-300 bg-white/5">
                    {editor.storage.characterCount.words()} palabras | {editor.storage.characterCount.characters()} caracteres
                </div>
            )}
        </div>
    );
}
