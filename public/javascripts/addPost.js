"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const htmlElement = document.documentElement;
  const themeToggleBtn =
    document.querySelector(".toggle-track") ||
    document.getElementById("themeToggle");
  const toggleIcon = document.getElementById("toggle-icon");
  const mainPreviewImg = document.querySelector(".preview-image");
  const mainPreviewWrap = document.querySelector(".preview-image-wrap");
  const thumbnailGrid = document.querySelector(".thumb-grid");
  const modelBadge = document.querySelector(".model-badge");
  const tagsContainer = document.querySelector(".tags-wrap");
  const addTagBtn = document.querySelector(".tag-add");
  const promptTextarea = document.querySelector(".field-mono");
  const aiToolSelect = document.querySelector(".field-select");
  const btnPublish = document.querySelector(".btn-publish");
  const btnSaveDraft = document.querySelector(".btn-secondary");
  const btnPreview = document.querySelector(".btn-outline");
  const toastContainer = document.getElementById("toast-container");

  function showNotification(message, type = "success") {
    if (!toastContainer) return;

    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    const iconName = type === "success" ? "check_circle" : "error";

    toast.innerHTML = `
      <span class="material-symbols-outlined toast-icon">${iconName}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => {
        toast.remove();
      });
    }, 3500);
  }

  function applyTheme(theme) {
    const isDark = theme === "dark" || theme === true;
    const resolvedTheme = isDark ? "dark" : "light";

    htmlElement.setAttribute("data-theme", resolvedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-checked", isDark ? "true" : "false");
    }

    if (toggleIcon) {
      toggleIcon.textContent = isDark ? "bedtime" : "wb_sunny";
    }

    try {
      localStorage.setItem("prest-theme", resolvedTheme);
    } catch (err) {
      console.warn("Storage Engine Write Fault: ", err);
    }
  }

  function handleRuntimeToggleAction() {
    const currentActiveTheme = htmlElement.getAttribute("data-theme");
    applyTheme(currentActiveTheme === "dark" ? "light" : "dark");
  }

  (function initThemePipeline() {
    let savedTheme;
    try {
      savedTheme = localStorage.getItem("prest-theme");
    } catch (_) {}
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    applyTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));
  })();

  if (themeToggleBtn) {
    themeToggleBtn.removeAttribute("onclick");
    themeToggleBtn.addEventListener("click", handleRuntimeToggleAction);
  }

  window.addEventListener("storage", (storageEvent) => {
    if (storageEvent.key === "prest-theme" && storageEvent.newValue) {
      applyTheme(storageEvent.newValue);
    }
  });

  const copyPromptBtn = document.querySelector(".copy-btn");
  if (copyPromptBtn && promptTextarea) {
    copyPromptBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const promptPayload = promptTextarea.value.trim();
      if (!promptPayload) {
        showNotification(
          "Clipboard payload is empty. Nothing to copy.",
          "error",
        );
        return;
      }

      try {
        await navigator.clipboard.writeText(promptPayload);
        copyPromptBtn.classList.add("copied");
        showNotification(
          "Prompt text copied safely to your system clipboard!",
          "success",
        );

        const internalIcon = copyPromptBtn.querySelector(
          ".material-symbols-outlined",
        );
        if (internalIcon) {
          const originalIconText = internalIcon.textContent;
          internalIcon.textContent = "done";

          setTimeout(() => {
            copyPromptBtn.classList.remove("copied");
            internalIcon.textContent = originalIconText;
          }, 1500);
        }
      } catch (_) {
        showNotification(
          "System hardware configurations blocked access to clipboard APIs.",
          "error",
        );
      }
    });
  }

  const asynchronousFileInput = document.createElement("input");
  asynchronousFileInput.type = "file";
  asynchronousFileInput.accept = "image/*";

  if (mainPreviewWrap) {
    mainPreviewWrap.addEventListener("click", () =>
      asynchronousFileInput.click(),
    );
  }

  asynchronousFileInput.addEventListener("change", (e) => {
    const contextFile = e.target.files[0];
    if (contextFile) {
      const fileReader = new FileReader();
      fileReader.onload = (readEvent) => {
        mainPreviewImg.style.transition = "opacity 0.15s ease";
        mainPreviewImg.style.opacity = "0.2";
        setTimeout(() => {
          mainPreviewImg.src = readEvent.target.result;
          mainPreviewImg.style.opacity = "1";
          showNotification("Showcase cover canvas updated.", "success");
        }, 150);
      };
      fileReader.readAsDataURL(contextFile);
    }
  });

  if (thumbnailGrid) {
    thumbnailGrid.addEventListener("click", (e) => {
      const targetThumbnail = e.target.closest(".thumb:not(.thumb-add)");
      if (targetThumbnail) {
        const nestedImg = targetThumbnail.querySelector("img");
        if (nestedImg && mainPreviewImg) {
          const primarySourceBuffer = mainPreviewImg.src;
          mainPreviewImg.src = nestedImg.src;
          nestedImg.src = primarySourceBuffer;
          showNotification("Display layout canvas swap finalized.", "success");
        }
      }
    });
  }

  if (aiToolSelect && modelBadge) {
    aiToolSelect.addEventListener("change", (e) => {
      modelBadge.style.transition = "opacity 0.15s ease";
      modelBadge.style.opacity = "0";
      setTimeout(() => {
        modelBadge.innerHTML = `
          <span class="material-symbols-outlined badge-icon">auto_awesome</span>
          ${e.target.value}
        `;
        modelBadge.style.opacity = "1";
      }, 150);
    });
  }

  if (tagsContainer) {
    tagsContainer.addEventListener("click", (e) => {
      const deletionAnchor = e.target.closest(".tag-remove");
      if (deletionAnchor) {
        const structuralTagNode = deletionAnchor.closest(".tag");
        structuralTagNode.style.transition =
          "transform 0.2s ease, opacity 0.2s ease";
        structuralTagNode.style.transform = "scale(0.8) translateY(4px)";
        structuralTagNode.style.opacity = "0";
        setTimeout(() => {
          structuralTagNode.remove();
          showNotification(
            "Categorization metadata element removed.",
            "success",
          );
        }, 200);
      }
    });
  }

  if (addTagBtn) {
    addTagBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const proposedToken = prompt(
        "Enter new tag classification token:",
      )?.trim();
      if (!proposedToken) return;

      const baselineTagsCollection = Array.from(
        tagsContainer.querySelectorAll(".tag"),
      ).map((tagNode) =>
        tagNode.textContent.replace("close", "").trim().toLowerCase(),
      );

      if (baselineTagsCollection.includes(proposedToken.toLowerCase())) {
        showNotification(
          "This descriptor categorization tag already exists.",
          "error",
        );
        return;
      }

      const generatedTag = document.createElement("span");
      generatedTag.className = "tag";
      generatedTag.innerHTML = `
        ${proposedToken}
        <button class="tag-remove" aria-label="Remove tag">
          <span class="material-symbols-outlined">close</span>
        </button>
      `;
      tagsContainer.insertBefore(generatedTag, addTagBtn);
      showNotification(`Added metadata marker: "${proposedToken}"`, "success");
    });
  }

  function packageFormPayload() {
    const presentTags = Array.from(
      document.querySelectorAll(".tags-wrap .tag"),
    ).map((node) => node.textContent.replace("close", "").trim());
    const dropdownTracks = document.querySelectorAll(".field-select");

    return {
      title:
        document
          .querySelector('input[placeholder*="Cybernetic"]')
          ?.value.trim() || "",
      description:
        document
          .querySelector(".field-textarea:not(.field-mono)")
          ?.value.trim() || "",
      promptText: promptTextarea ? promptTextarea.value.trim() : "",
      aiTool: dropdownTracks[0] ? dropdownTracks[0].value : "",
      category: dropdownTracks[1] ? dropdownTracks[1].value : "",
      tags: presentTags,
      isPublic:
        document.querySelector(".toggle-switch input")?.checked || false,
      coverImageSrc: mainPreviewImg ? mainPreviewImg.src : "",
      clientPushedTimestamp: new Date().toISOString(),
    };
  }

  if (btnPublish) {
    btnPublish.addEventListener("click", (e) => {
      const compiledPayload = packageFormPayload();

      if (!compiledPayload.title || !compiledPayload.promptText) {
        e.preventDefault();

        showNotification(
          "Title and Full Prompt fields are mandatory.",
          "error",
        );

        return;
      }

      const tagsInput = document.getElementById("tagsInput");

      if (tagsInput) {
        tagsInput.value = compiledPayload.tags.join(",");
      }

      showNotification(`Publishing "${compiledPayload.title}"...`, "success");
    });
  }

  if (btnSaveDraft) {
    btnSaveDraft.addEventListener("click", (e) => {
      e.preventDefault();
      const compiledPayload = packageFormPayload();
      console.log("Draft caching system state updated: ", compiledPayload);
      showNotification(
        "Local draft capture modification successfully saved.",
        "success",
      );
    });
  }

  if (btnPreview) {
    btnPreview.addEventListener("click", (e) => {
      e.preventDefault();
      const compiledPayload = packageFormPayload();
      console.log("Display Engine Sandbox Testing Payload: ", compiledPayload);
      showNotification(
        `Preview Engine Sandbox Ready: ${compiledPayload.title || "Untitled Schema Blueprint"}`,
        "success",
      );
    });
  }
});
