// import semua dependensi
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// coco ssd
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";

// utliti untuk menggambar box pada objek
import { drawRect } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {
    // memuat coco ssd
    const net = await cocossd.load();

    //  detect
    setInterval(() => {
      detect(net);
    }, 10);
  };

  const detect = async (net) => {
    // cek data jika ada
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // mengambil prperti
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // lebar video
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // tinggi video
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // membuat deteksi
      const obj = await net.detect(video);
      console.log(obj);

      // model gambar
      const ctx = canvasRef.current.getContext("2d");

      // mengabungkan objek dan gambar kotak
      drawRect(obj, ctx);
    }
  };

  useEffect(() => {
    runCoco();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
