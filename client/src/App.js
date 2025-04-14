import "./app.css";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setComments } from "./state";
import axios from "axios";
import { serverURL } from "./index.js";

function App() {
  // Using "useState" to keep track of Form Data.
  // However, using "useRef" is more efficient in this case.
  // ---------------------------------------------------------
  // const [formData, setFormData] = useState({
  //   name: "",
  //   age: "",
  //   email: "",
  //   location: "",
  //   date: "",
  //   comments: "",
  // });

  // const inputChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [id]: value,
  //   }));
  // };
  // ---------------------------------------------------------

  const comments = useSelector((state) => state.form.comments);
  const commentsMemo = useMemo(() => comments, [comments]);
  const dispatch = useDispatch();
  const [isEditCommentMode, setIsEditCommentMode] = useState(false);
  const [commentIdToEdit, setCommentIdToEdit] = useState("");

  const formRef = useRef();
  const nameRef = useRef();
  const ageRef = useRef();
  const emailRef = useRef();
  const locationRef = useRef();
  const commentsRef = useRef();
  const editCommentRef = useRef();

  const fields = [
    { id: "name", ref: nameRef, type: "text" },
    { id: "age", ref: ageRef, type: "number" },
    { id: "email", ref: emailRef, type: "email" },
    { id: "location", ref: locationRef, type: "text" },
    { id: "comments", ref: commentsRef, type: "text" },
  ];

  // CREATE COMMENT and send to the Server
  const createCommentToServer = async (formData) => {
    await axios
      .post(`${serverURL}/comments`, formData)
      .then((res) => {
        console.log("COMMENT SUCCESSFULLY POSTED : ", res.data);

        // Resetting the form
        formRef.current.reset();
      })
      .catch((err) => {
        console.log("ERROR : ", err.response.data);
      });
  };

  // READ COMMENTS from the Server
  const getCommentsFromServer = async () => {
    await axios
      .get(`${serverURL}/comments`)
      .then((res) => {
        const sortedComments = [...res.data].sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        console.log("COMMENTS FROM SERVER : ", sortedComments);
        dispatch(setComments(sortedComments));
        return;
      })
      .catch((err) => {
        console.log("ERROR: ", err.response.data);
        dispatch(setComments([]));
        return;
      });
  };

  // UPDATE A COMMENT in the Server
  const updateCommentToServer = async (commentId) => {
    const commentInState = commentsMemo.find((c) => c._id === commentId); // returns only the first match
    const editedComment = editCommentRef.current.value;

    if (!commentInState) {
      console.log("Comment Not Found");
      return;
    }

    if (editedComment === "") {
      editCommentRef.current.setCustomValidity("Please Enter a Comment");
      editCommentRef.current.reportValidity(); // triggers browser’s built-in error UI
      console.log("Please Enter a Comment");
      return;
    }

    if (editedComment === commentInState.comments) {
      console.log("No Changes Were Made to the Comment");
      return;
    }

    await axios
      .patch(`${serverURL}/comments`, {
        _id: commentId,
        comments: editCommentRef.current.value,
      })
      .then((res) => {
        console.log("COMMENT UPDATED SUCCESSFULLY : ", res.data);
        setCommentIdToEdit("");
        setIsEditCommentMode(false);
        getCommentsFromServer();
      })
      .catch((err) => {
        console.log("ERROR : ", err.response.data);
      });
  };

  // DELETE A COMMENT from the Server
  const deleteCommentFromServer = async (commentId) => {
    const commentInState = commentsMemo.find((c) => c._id === commentId); // returns only the first match

    if (!commentInState) {
      console.log("Comment Not Found");
      return;
    }
    await axios
      .delete(`${serverURL}/comments`, {
        // Axios requires the "data" key because the HTTP
        // specification does not mandate a request body for
        // DELETE requests. Axios uses "data" key to explicitly
        // indicate that a body should be included.
        data: { _id: commentId },
      })
      .then((res) => {
        console.log("COMMENT DELETED SUCCESSFULLY : ", res.data);
        getCommentsFromServer();
      })
      .catch((err) => {
        console.log("ERROR : ", err.response.data);
      });
  };

  const emailValidation = () => {
    const emailValue = emailRef.current?.value;
    const emailRegex =
      /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(emailValue)) {
      emailRef.current.setCustomValidity("Invalid Email Format");
      emailRef.current.reportValidity(); // triggers browser’s built-in error UI
    } else {
      emailRef.current.setCustomValidity(""); // resets the error message
      console.log("Valid Email Format:", emailValue);
    }
  };

  const dateAndTimeConversion = (isoDate) => {
    // Date
    const dateObj = new Date(isoDate);
    const day = String(dateObj.getDate()).padStart(2, "0"); // str.padStart(targetLength, padString)
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = dateObj.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Time
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      // "?" optional chaining, returns "undefined" if the value
      // is unassigned
      name: nameRef.current?.value,
      age: ageRef.current?.value,
      email: emailRef.current?.value,
      location: locationRef.current?.value,
      comments: commentsRef.current?.value,
    };
    // Create comment and send to server
    await createCommentToServer(formData);
    // After comment submission, fetch the updated comments
    await getCommentsFromServer();
  };

  // Fetch comments from the server when the component first renders.
  useEffect(() => {
    getCommentsFromServer();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Log the comments in the local state whenever they change.
  // This is useful for debugging purposes.
  useEffect(() => {
    console.log("COMMENTS IN LOCAL STATE : ", commentsMemo);
  }, [commentsMemo]);

  return (
    <>
      {/* Comment Form Section */}
      {/* ------------------------ */}
      <div>
        <h2>Comment Form</h2>
        <form ref={formRef} onSubmit={onSubmit}>
          {fields.map(({ id, ref, type }) => {
            return (
              <div key={`form-field-${id}`}>
                <div>
                  <label htmlFor={id}>
                    {id.charAt(0).toUpperCase() + id.slice(1)}
                  </label>
                  <br />
                  {id === "comments" ? (
                    // <textarea> element used for comments because it
                    // allows for multi-line text input.
                    // <input> is meant for single-line text input.
                    <textarea
                      id={id}
                      ref={ref}
                      className="comments-textarea"
                      required
                      // value={formData.comments}
                      // onChange={inputChange}
                    />
                  ) : (
                    <input
                      id={id}
                      ref={ref}
                      type={type}
                      {...(type === "number" && id === "age"
                        ? { min: 1, max: 150 }
                        : {})}
                      {...(type === "email" && id === "email"
                        ? { onChange: emailValidation }
                        : {})}
                      required
                      // value={formData[id]}
                      // onChange={inputChange}
                    />
                  )}
                </div>
                <br />
              </div>
            );
          })}
          <button type="submit">Submit</button>
        </form>
      </div>

      <br />
      <hr />

      {/* Previous Comments Section */}
      {/* ------------------------- */}
      <div>
        <h3> Previous Comments</h3>
        {comments.map(({ _id, name, email, location, createdAt, comments }) => {
          return (
            <div key={_id}>
              <div>{name}</div>
              <div>
                <i>{location}</i>
              </div>
              <div>{email}</div>
              <div>{dateAndTimeConversion(createdAt)}</div>

              {isEditCommentMode && commentIdToEdit === _id ? (
                <textarea
                  className="edit-comments-textarea"
                  ref={editCommentRef}
                  defaultValue={comments}
                  onChange={() => {
                    // Prevents the error message from constantly popping up
                    // when the textarea is being changed
                    editCommentRef.current.value !== "" &&
                      editCommentRef.current.setCustomValidity("");
                  }}
                />
              ) : (
                <div>{comments}</div>
              )}

              <div>
                {/* Save/Edit Button */}
                <button
                  type="button"
                  onClick={() => {
                    commentIdToEdit && editCommentRef.current.value !== ""
                      ? setCommentIdToEdit("")
                      : setCommentIdToEdit(_id);

                    isEditCommentMode && commentIdToEdit === _id
                      ? updateCommentToServer(_id)
                      : isEditCommentMode && commentIdToEdit !== _id
                      ? setCommentIdToEdit(_id)
                      : !isEditCommentMode && setIsEditCommentMode(true);
                  }}
                >
                  {isEditCommentMode && commentIdToEdit === _id
                    ? "Save"
                    : "Edit"}
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => {
                    deleteCommentFromServer(_id);
                  }}
                >
                  Delete
                </button>
              </div>
              <br />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
