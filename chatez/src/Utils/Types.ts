// storing data retrieved from getFriendMessages()
export type Message = {
    sender: string
    recipient: string
    message: string
    dateSent: Date
    read: boolean
    fileRef: string | null
}
