import React, {useRef, useState} from "react";
import EditorRenderer from "../../../../shared/ui/editor/EditorRenderer";
import { Scrollable } from "../../../../widgets/scroll";
import Avatar from "../../../../shared/ui/avatar/Avatar";
import FileUpload from "../../../../shared/ui/fileupload/Fileupload";
import FileElement from "../../../../shared/ui/fileupload/FlieElement";

export const TaskModalComments = ({
  comments = [],
  addComment,
  taskId,
  isLoading,
}) => {
  const [comment, setComment] = useState("");
    const [files, setFiles] = useState([]);

    const commentFiles = useRef([]);


  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

      const newMessage = {
          text: comment,
          files: files.map(file => ({
              id: file.id,
              name: file.name,
              extension: file.extension,
              blob: file ?? null,
          }))
      };

    try {
      await addComment(taskId, newMessage);
      setComment("");
      setFiles([])
    } catch (error) {
      console.error("Ошибка при отправке комментария:", error);
    }
  };

    const handleFileUpload = (uploadedFiles) => {
        const processedFiles = Array.from(uploadedFiles).map((file) => ({
            id: Math.random().toString(36).substring(2, 10) + file.name + file.lastModified + new Date().toISOString(), // Временный ID для UI
            name: file.name.split('.')[0],
            extension: `.${file.name.split('.').pop()}`,
            blob: file, // Сохраняем сам файл для отправки
        }));
        commentFiles.current = [...commentFiles.current, ...processedFiles]
        setFiles(prevFiles => [...prevFiles, ...processedFiles]);
    };
    const handleDeleteFile = (deletedFileId) => {
        setFiles(prev => {
            const updated = prev.filter(el => el.id !== deletedFileId);
            return updated;
        });
        commentFiles.current = commentFiles.current.filter(el => el.id !== deletedFileId)
    };


  return (
    <form className="tasks-modal__form" onSubmit={handleSubmit}>
      <div className="task-modal__title-small">
        Комментарии
        {comments.length > 0 && (
          <span
            style={{ marginLeft: "8px", fontSize: "14px", color: "#6F767E" }}
          >
            ({comments.length})
          </span>
        )}
      </div>

      {comments.length > 0 && (
        <div className="task-modal__comments">
          <Scrollable>
            {comments.map((commentItem, index) => {
                const files = commentItem?.files ?? [];
                return (
                    <div key={index} className="task-modal__comment" style={{}}>
                        <Avatar imageSrc={commentItem.image}/>
                        <div className={'task-modal__comment_inner'}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "5px",
                                }}
                            >
                              <span style={{fontWeight: "bold"}}>
                                {commentItem.author}
                              </span>
                                <span style={{color: "#6F767E", fontSize: "12px"}}>
                                {commentItem.date}
                              </span>
                            </div>
                            <EditorRenderer
                                className={"editor"}
                                content={commentItem.text}
                            />
                            <div className={'task-modal__comment-files'}>
                            {files.map((el) => (
                                <FileElement
                                    key={el.id}
                                    file={el}
                                />
                            ))}
                            </div>
                        </div>
                    </div>
                );
            })}
          </Scrollable>
        </div>
      )}
        <div className="task-modal__input">
            <FileUpload onFileUpload={handleFileUpload} />
            <textarea
                className="simple-textarea"
                value={comment}
                onChange={handleCommentChange}
                placeholder="Напишите комментарий..."
                disabled={isLoading}
            ></textarea>
        </div>

        <div className='files-container'>
            {files.map((el) => (
                <FileElement
                    onDelete={(id) => handleDeleteFile(id)}
                    key={el.id}
                    file={el}
                />
            ))}
        </div>
      <button type="submit" disabled={isLoading || !comment.trim()}>
        {isLoading ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
};
