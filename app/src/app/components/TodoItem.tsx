// components/TodoItem.tsx
export default function TodoItem({ item }) {
    return (
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <p>{item.text}</p>
        {/* Checkbox for marking as done, delete button, etc. */}
      </div>
    );
  }
  