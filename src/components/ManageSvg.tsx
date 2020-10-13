import { Box, Button, TextField } from "@material-ui/core";
import React, { useRef, useState } from "react";
import badge from "./../assets/youable-tessera.svg";
import { ReactSVG } from "react-svg";
import { Observable, Observer } from "rxjs";

interface SvgParams {
  nickname: string;
  title: string;
}

const afterSVG: any = (
  err: Error,
  svg: SVGElement,
  params: SvgParams
): void => {
  if (err) {
    console.error(err);
    return;
  }

  const title: any = svg.querySelector("[id='title']");
  const nickname: any = svg.querySelector("[id='nickname']");

  title.innerHTML = params.title;
  nickname.innerHTML = params.nickname;

  generateImage$().subscribe(
    (emit: any) => {
      console.log("xx", emit);
    },
    (err: Error) => {
      console.error(err);
    },
    () => {
      console.log("complete");
    }
  );
};

const generateImage$ = (): Observable<any> => {
  return new Observable((observer: Observer<any>) => {
    const svgBadge: HTMLElement | any = document.querySelector(
      '[id="my-svg"] svg'
    );
    const canvas: HTMLElement | any = document.querySelector('[id="canvas"]');

    canvas.setAttribute("width", svgBadge.clientWidth);
    canvas.setAttribute("height", svgBadge.clientHeight);

    const ctx: any = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();

    const svgString = new XMLSerializer().serializeToString(svgBadge);
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const DOMURL = window.URL || window.webkitURL || window;

    const pngContainer = document.getElementById("png-container");
    if (!pngContainer) {
      return;
    } else {
      const downloadImage = document.getElementById("downloadImage");
      if (downloadImage) {
        const src = downloadImage.getAttribute("src");
        if (src) {
          DOMURL.revokeObjectURL(src);
        }
        downloadImage.remove();
      }
    }

    const url = DOMURL.createObjectURL(svgBlob);

    img.onload = (): void => {
      ctx.drawImage(img, 0, 0);

      const png = canvas.toDataURL("image/png");
      pngContainer.innerHTML = `<img src="${png}"/>`;

      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("id", "downloadImage");
      downloadLink.href = png;
      downloadLink.download = "badge.png";

      pngContainer.appendChild(downloadLink);
    };

    img.onerror = (): void => {
      observer.error("image load fail");
    };

    img.src = url;

    observer.next(url);
    observer.complete();
  });
};

export const downloadPNG = (): void => {
  const pngContainer = document.getElementById("png-container");
  if (!pngContainer) {
    console.log("xxxxx");
    return;
  }

  const downloadImage = document.getElementById("downloadImage");
  if (downloadImage) {
    downloadImage.click();
  }
};

export const ManageSvg: React.FC<any> = () => {
  const [params, setParams] = useState<SvgParams>({ nickname: "", title: "" });
  const svgDataForm = useRef(null);

  const updateSVG = (): void => {
    const target: HTMLElement | any = svgDataForm.current;
    if (!target || target === null) {
      return;
    }

    const nameInput: HTMLInputElement = target.querySelector(
      '[name="nickname"]'
    );
    const titleInput: HTMLInputElement = target.querySelector('[name="title"]');

    setParams({ nickname: nameInput.value, title: titleInput.value });
  };

  return (
    <>
      <form ref={svgDataForm}>
        <Box m={1}>
          <TextField id="standard-basic" label="Nickname" name="nickname" />
        </Box>
        <Box m={1}>
          <TextField id="standard-basic" label="Title" name="title" />
        </Box>
        <Box m={1} style={{ textAlign: "right" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => updateSVG()}
          >
            Genera
          </Button>
        </Box>
      </form>
      <Box
        m={1}
        style={{ position: "absolute", top: "-100000px", left: "0px" }}
      >
        <ReactSVG
          id="my-svg"
          src={badge}
          afterInjection={(error: Error | null, svg: SVGElement | any): void =>
            afterSVG(error, svg, params)
          }
        />
      </Box>
      <Box m={1} style={{ textAlign: "right" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => downloadPNG()}
        >
          Downlaod
        </Button>
      </Box>
      <canvas id="canvas" style={{ display: "none" }}></canvas>
      <Box m={1}>
        <div id="png-container"></div>
      </Box>
    </>
  );
};

export default ManageSvg;
