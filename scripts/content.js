const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        if (
          node.textContent?.includes("Suggested for you") &&
          node instanceof HTMLDivElement
        ) {
          const nodeObserver = new MutationObserver((nodeMutations) => {
            for (const nodeMutation of nodeMutations) {
              for (const maybeVideoContainer of nodeMutation.addedNodes) {
                if (!(maybeVideoContainer instanceof HTMLDivElement)) {
                  continue;
                }

                const videoElement = maybeVideoContainer.querySelector("video");

                if (!videoElement) {
                  continue;
                }

                const videoContainer = videoElement.closest(
                  "div[data-visualcompletion]",
                )?.parentElement;

                if (!(videoContainer instanceof HTMLDivElement)) {
                  continue;
                }

                videoContainer.style.display = "none";

                let hidden = true;
                const btn = document.createElement("button");
                btn.innerText = "Show the video";
                btn.onclick = () => {
                  if (!(videoContainer instanceof HTMLDivElement)) {
                    return;
                  }

                  if (hidden) {
                    videoContainer.style.display = "block";
                    hidden = false;
                    btn.innerText = "Hide the video";
                  } else {
                    videoContainer.style.display = "none";
                    hidden = true;
                    btn.innerText = "Show the video";
                  }
                };
                node.children[0].prepend(btn);
                return;
              }
            }
          });

          nodeObserver.observe(node, {
            attributes: false,
            childList: true,
            subtree: true,
          });

          const imgs = node.querySelectorAll("img");

          for (const img of imgs) {
            if (img.width > 200) {
              img.style.filter = "blur(15px)";

              img.onmouseenter = () => {
                img.style.filter = "blur(0px)";
              };

              img.onmouseleave = () => {
                img.style.filter = "blur(15px)";
              };

              const imgContainer =
                img.closest("a")?.parentElement?.parentElement;

              if (!imgContainer) {
                continue;
              }

              imgContainer.style.display = "none";

              let hidden = true;
              const btn = document.createElement("button");
              btn.innerText = "Show the photo";
              btn.onclick = () => {
                if (!imgContainer) {
                  return;
                }

                if (hidden) {
                  imgContainer.style.display = "block";
                  hidden = false;
                  btn.innerText = "Hide the photo";
                } else {
                  imgContainer.style.display = "none";
                  hidden = true;
                  btn.innerText = "Show the photo";
                }
              };
              node.children[0].prepend(btn);

              const altDiv = document.createElement("div");
              altDiv.style.color = "hotpink";
              altDiv.style.fontSize = "1rem";
              altDiv.innerHTML = img.alt;
              node.children[0].prepend(altDiv);
            }
          }
        }
      }
    }
  }
});

observer.observe(document.body.getElementsByTagName("div")[0], {
  attributes: false,
  childList: true,
  subtree: true,
});
