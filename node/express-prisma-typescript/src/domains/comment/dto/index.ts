export class CommentDto {
  constructor (comment: CommentDto) {
    this.id = comment.id
    this.parentPostId = comment.parentPostId
    this.childPostId = comment.childPostId
    this.createdAt = comment.createdAt
  }

  id: string
  parentPostId: string
  childPostId: string
  createdAt: Date
}
