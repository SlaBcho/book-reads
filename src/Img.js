import React from "react";
import { useRef } from "react";
import { useState } from "react";

export const Img = () => {
  let [photo, setPhoto] = useState("");
  let imgRef = useRef();
  let handleSubmit = e => {
    e.preventDefault();
    console.log({ photo });
  };

  return (
    <div id="myFormDiv">
      <form onSubmit={handleSubmit}>
        <input
          accept="image/*"
          type="file"
          onChange={e => {
            console.log(e.target.files);
            setPhoto(e.target.value);
            var src = URL.createObjectURL(e.target.files[0]);
            imgRef.current.src = src;
          }}
        />
        <img style={{ height: "200px", width: "200px" }} ref={imgRef} alt='img'/>
        <button>SUBMIT</button>
      </form>
    </div>
  );
};
