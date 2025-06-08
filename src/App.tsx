import { createMergeableStore } from 'tinybase'
import { createLocalPersister } from 'tinybase/persisters/persister-browser'
import {
  useCreatePersister,
  useCreateMergeableStore,
  useTable,
} from 'tinybase/ui-react'

export const App = () => {
  const store = useCreateMergeableStore(createMergeableStore)

  useCreatePersister(
    store,
    (store) =>
      createLocalPersister(store, 'jldec-tinybase-localpersister-repro'),
    [],
    async (persister) => {
      await persister.startAutoLoad()
      await persister.startAutoSave()
    }
  )

  const messages = useTable('messages', store)

  function addMessage(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    store.addRow('messages', { message: 'Hello world ' + Date.now() })
  }

  // Reset the messages table to a single message
  // FYI - I'm not sure why store.setTable('messages', {}) does nothing
  async function resetMessages(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()
    store.setTable('messages', {
      0: { message: 'Reset' },
    })
  }

  return (
    <>
      <button onClick={addMessage}>Add Message</button>{' '}
      <button onClick={resetMessages}>Reset</button>
      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </>
  )
}
