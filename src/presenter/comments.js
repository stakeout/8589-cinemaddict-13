import CommentsSectionView from "../view/comments-section";
import CommentUserView from "../view/comment-user";
import MessageUserView from "../view/message-user";
import {render, RenderPosition, remove, replace} from "../utils/render";
import {UserAction, UpdateType} from "../consts";

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class Comments {
  constructor(commentsContainer, changeData, commentsModel, api) {
    this._commentsContainer = commentsContainer;
    this._changeData = changeData;
    this._commentsModel = commentsModel;
    this._api = api;

    this._commentsSectionComponent = null;
    this._commentUserComponent = null;
    this._messageUserComponent = null;

    this._renderCommentsBlock = this._renderCommentsBlock.bind(this);
    this._handleDeleteComment = this._handleDeleteComment.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
  }

  init(movie) {
    this._movie = movie;
    const prevCommentsSectionComponent = this._commentsSectionComponent;
    this._commentsSectionComponent = new CommentsSectionView(this._movie);
    if (prevCommentsSectionComponent === null) {
      this._renderCommentsBlock();
      return;
    }

    if (this._commentsContainer.contains(prevCommentsSectionComponent.getElement())) {
      replace(this._commentsSectionComponent, prevCommentsSectionComponent);
      this._renderCommentsBlock();
    }
  }

  destroy() {
    this._commentsContainer = null;
    remove(this._commentsSectionComponent);
    if (this._commentUserComponent !== null) {
      remove(this._commentUserComponent);
    }
    remove(this._messageUserComponent);
  }

  _renderCommentsBlock() {
    render(this._commentsContainer, this._commentsSectionComponent, RenderPosition.BEFOREEND);
    const commentsList = this._commentsSectionComponent.getCommentsList();
    const comments = this._commentsModel.getComments();

    if (this._movie.comments.length) {
      this._movie.comments.forEach((commentID) => {
        const index = comments.findIndex((comment) => commentID === comment.id);
        const comment = comments[index];
        this._commentUserComponent = new CommentUserView(comment);
        render(commentsList, this._commentUserComponent, RenderPosition.BEFOREEND);
        if (comment.deletion === `deletion`) {
          this.shake(this._commentUserComponent.getElement());
          comment.deletion = null;
        }
        this._commentUserComponent.setCommentDeleteBtnHandler(this._handleDeleteComment);
      });
    }

    this._messageUserComponent = new MessageUserView();
    render(this._commentsSectionComponent, this._messageUserComponent, RenderPosition.BEFOREEND);

    this._messageUserComponent.setFormSubmitHandler(this._handleAddComment);
    this._messageUserComponent.restoreHandlers();
  }

  shake(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = ``;
      element.disabled = false;
      element.focus();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _handleAddComment() {
    if (this._messageUserComponent.getNewDate().emotion !== `` && this._messageUserComponent.getNewDate().comment !== ``) {
      this._messageUserComponent.getMessageUserTextarea().disabled = true;
      this._api.addComment(this._movie, this._messageUserComponent.getNewDate())
        .then((response) => {
          this._commentsModel.setComments(UpdateType.PATCH, response);
          this._changeData(
              UserAction.UPDATE_FILM,
              UpdateType.PATCH,
              this._movie
          );

        })
        .catch(() => {
          this.shake(this._messageUserComponent.getMessageUserTextarea());
        });
    }
  }


  _handleDeleteComment() {
    const comments = this._commentsModel.getComments();
    const index = comments.findIndex((comment) => comment.delete);
    this._api.deleteComment(comments[index].id)
        .then(() => {
          this._commentsModel.deleteComment(comments[index].id);
          this._changeData(
              UserAction.UPDATE_FILM,
              UpdateType.PATCH,
              this._movie
          );
        })
        .catch(() => {
          this.shake(this._commentUserComponent.getCommentText());
        });
  }
}
