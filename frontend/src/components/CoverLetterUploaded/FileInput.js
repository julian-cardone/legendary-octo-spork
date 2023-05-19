import { useDispatch } from "react-redux";
import { newCoverLetter } from "../../store/coverLetter";

function FileInput(user) {

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    let files = e.target.files;

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);

    reader.onload = (e) => {
      console.warn("data ", e.target.result);

      const formData = { file: e.target.result };
      dispatch(newCoverLetter({ file: formData, userId: user }));
    };
  };

  return (
    <>
      <form class="mb-3">
        <label htmlFor="formFile" className="form-label">
          Default file input example
        </label>
        <input
          className="form-control"
          type="file"
          id="formFile"
          onChange={(e) => handleSubmit(e)}
        />
      </form>
    </>
  );
}

export default FileInput;