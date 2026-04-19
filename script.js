// Scores
let scores = { Duolingo: 0, Lingualeo: 0, Poliglot16: 0, OxfordCourses: 0 };

// Scenes (dialogue + questions)
let scenes = [
     // Opening Dialogue
  { type: "dialogue", 
    text: "The quiz that will tell you the best way to learn English online", 
    image: "/images/haian.png", maxWidth: "200px", 
    buttonText: "Enter",
    isTitle: true
  },
  // Questions Set 1
  { type: "question", text: "How do you prefer to learn new things?", options: [
    { text: "Through games and fun challenges", apps: ["Duolingo"] },
    { text: "By reading and exploring content at my own pace", apps: ["Lingualeo"] },
    { text: "By following a clear, step-by-step system", apps: ["Poliglot16"] },
    { text: "With structured lessons and a teacher", apps: ["OxfordCourses"] }
  ]},
  { type: "question", text: "What motivates you the most?", options: [
    { text: "Rewards, streaks, and levels", apps: ["Duolingo"] },
    { text: "Interesting topics and real-life content", apps: ["Lingualeo"] },
    { text: "Fast, visible results", apps: ["Poliglot16"] },
    { text: "Certificates and serious progress", apps: ["OxfordCourses"] }
  ]},
  { type: "question", text: "How much time do you want to spend daily?", options: [
    { text: "5–10 minutes", apps: ["Duolingo"] },
    { text: "10–20 minutes", apps: ["Lingualeo"] },
    { text: "20–30 minutes", apps: ["Poliglot16"] },
    { text: "30+ minutes", apps: ["OxfordCourses"] }
  ]},
  { type: "question", text: "What is your main goal?", options: [
    { text: "Just learn basics for fun", apps: ["Duolingo"] },
    { text: "Understand and read/watch content", apps: ["Lingualeo"] },
    { text: "Start speaking quickly", apps: ["Poliglot16"] },
    { text: "Master the language deeply", apps: ["OxfordCourses"] }
  ]},

  // Questions Set 2
     { type: "question", text: "How do you feel about grammar?", options: [
    { text: "I avoid it if possible", apps: ["Duolingo"] },
    { text: "I learn it naturally through examples", apps: ["Lingualeo"] },
    { text: "I want simple explanations", apps: ["Poliglot16"] },
    { text: "I want full, detailed rules", apps: ["OxfordCourses"] }
  ]},
  { type: "question", text: "What type of learning feels best?", options: [
    { text: "Interactive and playful", apps: ["Duolingo"] },
    { text: "Flexible and personalized", apps: ["Lingualeo"] },
    { text: "Intensive and focused", apps: ["Poliglot16"] },
    { text: "Academic and traditional", apps: ["OxfordCourses"] }
  ]} ]



// Track current scene
let currentScene = 0;

// Preload the first few images to prevent blinking
const preloadImages = [

];

preloadImages.forEach(src => {
  const img = new Image();
  img.src = src; // browser caches it now
});

function showScene() {
  let scene = scenes[currentScene];
  let textBox = document.getElementById("text-box");
  let buttonsDiv = document.getElementById("buttons");
  
  // Remove previous font and dialogue classes
  textBox.classList.remove("title-font", "question-font", "dialogue-scene");

  // Apply font classes
  if (scene.isTitle) {
      textBox.classList.add("title-font");
  } else if (scene.type === "question") {
      textBox.classList.add("question-font");
  }

 if (scene.type === "dialogue" && !scene.isCreatorNote && !scene.isTitle) {
    textBox.classList.add("dialogue-scene");
}

  // Show text
  if (scene.type === "dialogue" && scene.isCreatorNote) {
      textBox.innerHTML = `<div class="creator-note">${scene.text}</div>`; // allow HTML
  } else {
      textBox.textContent = scene.text;
  }

  // Show image if there is one
  let imageDiv = document.getElementById("image");
  imageDiv.innerHTML = "";
  if (scene.image) {
      let img = document.createElement("img"); // make new <img> element 
      img.src = scene.image; // set the source
      img.style.maxWidth = scene.maxWidth || "300px"; // set max width

      if (scene.fadeIn) {
          img.classList.add("fade-in");
          setTimeout(() => {
              img.classList.add("show");
          }, 10);
      }

      imageDiv.appendChild(img); // append it to the imageDiv
  } 

  // Show buttons
  buttonsDiv.innerHTML = "";

  if (scene.type === "dialogue") {
      if (scene.buttons) {
          // Multiple buttons
          scene.buttons.forEach(label => {
              let btn = document.createElement("button");
              btn.textContent = label;
              btn.classList.add("dialogue-btn"); // style for dialogue
              btn.onclick = () => {
                  if (scene.sound) {
                      const audio = new Audio(scene.sound);
                      audio.currentTime = 0;
                      audio.play();
                  }
                  currentScene++;
                  showScene();
              };
              buttonsDiv.appendChild(btn);
          });
      } else {
          // Single button (default or custom)
          let btn = document.createElement("button");
          btn.textContent = scene.buttonText || "Next";
          btn.classList.add("dialogue-btn"); // style for dialogue
          btn.onclick = () => {
              if (scene.sound) {
                  const audio = new Audio(scene.sound);
                  audio.currentTime = 0;
                  audio.play();
              }
              currentScene++;
              showScene();
          };
          buttonsDiv.appendChild(btn);
      }
  } 
  else if (scene.type === "question") {
      scene.options.forEach(option => {
          let btn = document.createElement("button");
          btn.textContent = option.text;
          btn.classList.add("question-btn"); // style for questions
          btn.onclick = () => {
              option.apps.forEach(app => scores[app] += 1);
              currentScene++;
              if (currentScene >= scenes.length) {
                  showResult();
              } else {
                  showScene();
              }
          };
          buttonsDiv.appendChild(btn);
      });
  }
}



function showResult() {
  const textBox = document.getElementById("text-box");
  const container = document.getElementById("container");
  textBox.classList.add("results-active");
  container.classList.add("results-active");

  const buttonsDiv = document.getElementById("buttons");
  buttonsDiv.innerHTML = "";

  // show overlay when results appear
  const overlay = document.getElementById("overlay");
  overlay.style.opacity = 1;

  // Determine top cat
  const topApp = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
  textBox.textContent = `Your best way to learn English online is ... ${topApp}`;

  const IMAGE_DIR = "/images/";
  const appImages = {
    Duolingo:  "duo.png",
    Lingualeo: "ling.png",
    Poliglot16: "16.png",
    OxfordCourses: "ox.png",
  };

  // Create image
  const img = document.createElement("img");
  img.classList.add("app-result"); // keeps styling like border-radius/margin
  img.alt = `${topApp}`;
  img.src = IMAGE_DIR + appImages[topApp];

// inside showResult()
if (window.innerWidth >= 1600) {
    img.style.width = "500px"; // big desktop
} else if (window.innerWidth >= 1025) {
    img.style.width = "500px"; // laptops / MacBooks
} else {
    img.style.width = "85%"; // tablet/mobile
}

  img.style.setProperty("height", "auto", "important"); // always scale proportionally

  // Error fallback
  img.onerror = () => {
    console.warn("Image failed to load:", img.src);
    textBox.textContent += " (Image not found)";
  };

  buttonsDiv.appendChild(img);

  // Back to Home button
  const homeBtn = document.createElement("button");
  homeBtn.textContent = "Back to Home";
  homeBtn.onclick = () => {
      overlay.style.opacity = 0;
      textBox.classList.remove("results-active");
      scores = { Fire: 0, Plant: 0, Seaside: 0, Moon: 0 };
      currentScene = 0;
      showScene();
  };
  buttonsDiv.appendChild(homeBtn);

}


showScene();

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const modalDesc = document.getElementById("modal-description");
    const closeModal = document.getElementById("close-modal");

    document.querySelectorAll(".cat-thumb").forEach(thumb => {
        thumb.addEventListener("click", () => {
            modal.style.display = "flex";
            modalImg.src = thumb.dataset.stat;
            modalDesc.textContent = thumb.dataset.description;
        });
    });

    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });
});

function setVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

window.addEventListener('resize', setVh);
window.addEventListener('load', setVh);
setVh();