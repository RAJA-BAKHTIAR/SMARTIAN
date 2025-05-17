const gallery = document.getElementById('gallery');
const uploadForm = document.getElementById('uploadForm');
const tapSound = document.getElementById('tapSound');

// Unique session token for owner control
const ownerToken = localStorage.getItem("ownerToken") || (() => {
  const token = crypto.randomUUID();
  localStorage.setItem("ownerToken", token);
  return token;
})();

uploadForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const file = document.getElementById('imageInput').files[0];
  const caption = document.getElementById('captionInput').value;

  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const imageData = {
      id: crypto.randomUUID(),
      image: reader.result,
      caption: caption,
      owner: ownerToken
    };
    saveImage(imageData);
    renderImage(imageData);
  };
  reader.readAsDataURL(file);

  uploadForm.reset();
});

function playTapSound() {
  tapSound.currentTime = 0;
  tapSound.play();
}

function saveImage(data) {
  const images = JSON.parse(localStorage.getItem("images") || "[]");
  images.push(data);
  localStorage.setItem("images", JSON.stringify(images));
}

function deleteImage(id) {
  let images = JSON.parse(localStorage.getItem("images") || "[]");
  images = images.filter(img => img.id !== id);
  localStorage.setItem("images", JSON.stringify(images));
  loadGallery();
}

function editCaption(id) {
  const newCaption = prompt("Edit caption:");
  if (newCaption !== null) {
    const images = JSON.parse(localStorage.getItem("images") || "[]");
    const img = images.find(img => img.id === id);
    if (img) {
      img.caption = newCaption;
      localStorage.setItem("images", JSON.stringify(images));
      loadGallery();
    }
  }
}

function loadGallery() {
  gallery.innerHTML = '';
  const images = JSON.parse(localStorage.getItem("images") || "[]");
  images.forEach(renderImage);
}

function renderImage(data) {
  const div = document.createElement('div');
  div.className = 'image-card';
  div.innerHTML = `
    <img src="${data.image}" alt="User image">
    <p>${data.caption || '(No caption)'}</p>
    <div class="image-actions">
      <button onclick="alert('Reported. Admin will review. 📩')">⚠️ Report</button>
      ${data.owner === ownerToken ? `
        <button onclick="editCaption('${data.id}')">✏️ Edit</button>
        <button onclick="deleteImage('${data.id}')">❌ Delete</button>
      ` : ''}
    </div>
  `;
  gallery.appendChild(div);
}

window.onload = loadGallery;
