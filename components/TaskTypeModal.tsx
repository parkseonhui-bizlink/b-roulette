import { useState } from 'react';

export default function TaskTypeModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (taskType: string) => void }) {
  const [selectedType, setSelectedType] = useState<string>('type1');

  const handleSubmit = () => {
    onSubmit(selectedType);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
      <div className='bg-white p-6 rounded-md shadow-md'>
        <h2 className='text-xl font-bold mb-4'>タスクの種類を選択してください</h2>
        <form>
          <label className='block mb-2'>
            <input
              type='radio'
              name='taskType'
              value='type1'
              checked={selectedType === 'type1'}
              onChange={(e) => setSelectedType(e.target.value)}
              className='mr-2'
            />
            朝会
          </label>
          <label className='block mb-2'>
            <input
              type='radio'
              name='taskType'
              value='type2'
              checked={selectedType === 'type2'}
              onChange={(e) => setSelectedType(e.target.value)}
              className='mr-2'
            />
            月初
          </label>
          <label className='block mb-4'>
            <input
              type='radio'
              name='taskType'
              value='type3'
              checked={selectedType === 'type3'}
              onChange={(e) => setSelectedType(e.target.value)}
              className='mr-2'
            />
            月末
          </label>
          <button type='button' onClick={handleSubmit} className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
            確定
          </button>
        </form>
        <button onClick={onClose} className='mt-4 text-gray-500 underline'>
          キャンセル
        </button>
      </div>
    </div>
  );
}
