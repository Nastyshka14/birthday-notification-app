import { EventForm } from '../EventForm'
import './UpdateEventForm.scss'

export const UpdateEventForm = ({ eventID }: { eventID: string }) => {
  return <EventForm ID={eventID} />
}
