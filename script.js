import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

const firebaseConfig = {
  apiKey: "AIzaSyC5FSiWaclXHNUxSOUf68JnzMwFbjSOB3E",
  authDomain: "joblist-fc90f.firebaseapp.com",
  projectId: "joblist-fc90f",
  storageBucket: "joblist-fc90f.appspot.com",
  messagingSenderId: "239739972191",
  appId: "1:239739972191:web:0d1e8617ff6aa89e0c49ea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)


const main = document.getElementById('main')
const goBackBtn = document.getElementById('go_back')
const jobList = document.getElementById('job_list')
const addBtn = document.getElementById('add_btn')
const userName = document.getElementById('user_name')
const jobsEl = document.getElementById('jobEl')
const noJob = document.getElementById('no_job')
console.log("🚀 ~ noJob:", noJob)

const isVerified = JSON.parse(localStorage.getItem('verified'))
const isEmpty = JSON.parse(localStorage.getItem('is_empty'))

if (isEmpty) {
  noJob.innerText = 'Your Jobs list will appear here!'
} else {
  noJob.innerText = ''
}

// if(loading){
//   const img = document.createElement('img')
//   img.setAttribute('src', './asset/loader.gif')
//   main.appendChild(img)
// }


window.onload = function () {
  getLocation()
}

async function getAllJobs() {
  try {
    const querySnapshot = await getDocs(collection(db, 'jobs'));
    querySnapshot.forEach((doc) => {
      return jobs(doc.id, doc.data())
    });
  } catch (e) {
    console.error("Error getting documents: ", e);
  }
}

getAllJobs()


function jobs(id, data) {

  // const img = document.createElement('img')
  // img.setAttribute('src', './asset/loader.gif')
  // if (loading) {
  //   jobsEl.appendChild(img)
  // }else{{
  //   jobsEl.removeChild(img)
  // }}

  const job = document.createElement('div')
  job.innerHTML += `
   <div key=${id} class="flex items-center justify-between py-5 px-6 bg-[#1e1c24] rounded-xl mb-3">
            <div>
                <h2 class="text-base font-medium text-white font_poppins">${data.position}</h2>
                <span class="font_poppins text-[#8F8F9E] text-sm">Karachi, Pakistan</span>
            </div>
             <div class="flex gap-5">
               <button class='edit_job' data-id=${id}>
                  <img src="./asset/icons/edit-icon.svg"/>
               </button>
               <button class='remove_job' data-id=${id}>
                <img src="./asset/icons/trash-icon.svg">
               </button>
             </div>
        </div>`
  jobsEl.appendChild(job)
  const deleteBtn = job.querySelector('.remove_job')
  const editBtn = job.querySelector('.edit_job')
  deleteBtn.addEventListener('click', (e) => deleteJob(e, id))
  editBtn.addEventListener('click', (e) => editJob(e, id))

}

async function deleteJob(e, id) {
  e.stopPropagation();
  await deleteDoc(doc(db, 'jobs', id));
  window.alert('job has success full delete')
}

function editJob(e, id) {
  e.stopPropagation();
  main.innerHTML = ''
  addAndEditJob(id)
}


const name = JSON.parse(localStorage.getItem('username'))

userName.innerText = name
goBackBtn.addEventListener('click', () => {
  main.innerHTML = ''
  localStorage.setItem('verified', false)
  loginHandle()
})

addBtn.addEventListener('click', () => {
  main.innerHTML = ''
  addAndEditJob()
})


main.removeChild(jobList)
loginHandle()



if (isVerified) {
  main.innerHTML = ''
  main.appendChild(jobList)
} else {
  main.removeChild(jobList)
  loginHandle()
}


function loginHandle() {
  const login = document.createElement('div')
  login.setAttribute('id', 'login')
  login.innerHTML += `
  <h1 class="text-[35px] font-semibold mt-10 font_poppins leading-[41px] text-white mb-4">Let’s sign you in</h1>
          <p class="font_poppins text-[30px] text-white leading-[41px] -tracking-[0.5px]  opacity-95 mb-[67px]">Welcome back 
            you’ve been missed !</p>

        <form action="submitt_form" id='submit_login'>
            <input type="email" name="" id="email" placeholder="Enter your email address" class="placeholder:text-[#8F8F9E] bg-[#1e1c24] font_poppins -tracking-[0.5px] outline-none  text-white py-1 border border-[#5D5D67] rounded-xl px-4 py-5 mb-5 w-full" required />
            <input type="password" name="" id="password" placeholder="Enter your password" class="placeholder:text-[#8F8F9E] font_poppins -tracking-[0.5px]  outline-none bg-[#1e1c24] text-white py-1 border border-[#5D5D67] rounded-xl px-4 py-5 mb-20 w-full" required />
            <p class="text-center font_poppins -tracking-[0.5px] text-[#8F8F9E] text-base mb-4">Don’t have an account ? <button  type="button" class="text-white font-semibold" id='register_btn'>Register</button></p>
            <button type="button" class="w-full bg-white py-4 -tracking-[0.5px] leading-10 text-[#191720] font-semibold rounded-[15px]" id="sign_in">
                Sign In
            </button>
        </form>`
  main.appendChild(login)
  const regBtn = document.getElementById('register_btn')
  const email = document.getElementById('email')
  const password = document.getElementById('password')
  const submitBtn = document.getElementById('sign_in')

  regBtn.addEventListener('click', handleSwitchToSignup)
  submitBtn.addEventListener('click', () => loginWithUserCredentials(email, password))
}

function handleSwitchToSignup() {
  main.innerHTML = ''
  signUpHandle()
}


function loginWithUserCredentials(email, password) {
  const emailValue = email.value
  const passwordValue = password.value

  signInWithEmailAndPassword(auth, emailValue, passwordValue).then(() => {
    console.log('success! Welcome back!')
    window.alert('success! Welcome back!')
    localStorage.setItem('verified', true)
  }
  ).catch((error) => {
    console.log(error.message, '>>>>error')
    window.alert('invalid credentials try again')
    localStorage.setItem('verified', false)
  })
  main.innerHTML = ''
  main.appendChild(jobList)
}



function signUpHandle() {
  const signup = document.createElement('div')
  signup.innerHTML += `
    <h1 class="text-[35px] font-semibold mt-10 font_poppins leading-[41px] text-white mb-4">Let’s sign you up</h1>
    <p class="font_poppins text-[30px] text-white leading-[41px] -tracking-[0.5px]  opacity-95 mb-[67px]">Welcome Join the community!</p>

  <form action="">
  <input type="text" name="" id="name" placeholder="Enter your full name" class="placeholder:text-[#8F8F9E] bg-[#1e1c24] font_poppins -tracking-[0.5px] outline-none  text-white py-1 border border-[#5D5D67] rounded-xl px-4 py-5 mb-5 w-full" required />
      <input type="email" name="" id="email" placeholder="Enter your email address" class="placeholder:text-[#8F8F9E] bg-[#1e1c24] font_poppins -tracking-[0.5px] outline-none  text-white py-1 border border-[#5D5D67] rounded-xl px-4 py-5 mb-5 w-full" required>
      <input type="password" name="" id="password" placeholder="Enter your password" class="placeholder:text-[#8F8F9E] font_poppins -tracking-[0.5px]  outline-none bg-[#1e1c24] text-white py-1 border border-[#5D5D67] rounded-xl px-4 py-5 mb-20 w-full" required/>
      <p class="text-center font_poppins -tracking-[0.5px] text-[#8F8F9E] text-base mb-4">Already have an account ? <button class="text-white font-semibold" id='sign_in'>Sign In</button></p>
      <button type="button" class="w-full bg-white py-4 -tracking-[0.5px] leading-10 text-[#191720] font-semibold rounded-[15px]" id="sign_up">
        Sign Up
      </button>
  </form>
 `
  main.appendChild(signup)
  const signInBtn = document.getElementById('sign_in')
  const name = document.getElementById('name')
  const email = document.getElementById('email')
  const password = document.getElementById('password')
  const submit = document.getElementById('sign_up')

  signInBtn.addEventListener('click', handlSwitchToLogin)
  submit.addEventListener('click', () => handleSignUp(name, email, password))
}

function handlSwitchToLogin() {
  main.innerHTML = ''
  loginHandle()
}

function handleSignUp(name, email, password) {
  const nameValue = name.value
  const emailValue = email.value
  const passwordvlue = password.value
  localStorage.setItem('username', JSON.stringify(nameValue))
  createUserWithEmailAndPassword(auth, emailValue, passwordvlue).then((userCredential) => {
    console.log('userCredential >>>', userCredential)
    window.alert('user created')
  }).catch((error) => {
    console.log('error', error.message)
    window.alert('usera already exits')
  })
  main.innerHTML = ''
  loginHandle()
}


async function addAndEditJob(jobId = null) {
  const jobPost = document.createElement('div')

  jobPost.innerHTML += `
    <div class="flex w-full items-center gap-8 mb-6">
    <button id='go_back'>
        <img src="./asset/icons/chevron.svg">
    </button>
    <p class="text-[25px] font_poppins text-white font-semibold">${jobId ? "Edit Job" : "Add New Job"}</p>
   </div>

   <input type="text" name="" id="position" placeholder="Enter position name" class="placeholder:text-[#8F8F9E] bg-[#1e1c24] font_poppins -tracking-[0.5px] outline-none  text-white py-1 border border-[#5D5D67] rounded-xl px-4 py-5 mb-5 w-full"/>
   <textarea name="" id="description" class="placeholder:text-[#8F8F9E] bg-[#1e1c24] font_poppins -tracking-[0.5px] outline-none  text-white py-1 border border-[#5D5D67] rounded-xl px-4 py-5 mb-10 w-full resize-none min-h-[300px]" placeholder="Describe Requirement..."></textarea>
   <button type="submit" class="w-full bg-white py-4 -tracking-[0.5px] leading-10 text-[#191720] font-semibold rounded-[15px]" id="submit">
    ${jobId ? 'Update Job' : 'Submit Job'}
</button>`
  main.appendChild(jobPost)
  const goBackBtn = document.getElementById('go_back')
  const position = document.getElementById('position')
  const discription = document.getElementById('description')
  const submitBtn = document.getElementById('submit')

  goBackBtn.addEventListener('click', handleSwitchToMain)
  submitBtn.addEventListener('click', () => addEditDetails(position, discription, jobId))

  if (jobId) {
    const docRef = doc(db, 'jobs', jobId);
    const docSnap = await getDoc(docRef);

    const data = docSnap.data();
    discription.value = data.description
    position.value = data.position
  }
}



async function addEditDetails(position, description, jobId) {
  const positionValue = position.value
  const descriptionValue = description.value

  if (jobId) {
    const docRef = doc(db, 'jobs', jobId);
    await updateDoc(docRef, {
      position: positionValue,
      description: descriptionValue
    });
    window.alert('job successfuly updated!')
    main.innerHTML = ''
    main.appendChild(jobList)
  }else{  
   if (positionValue || descriptionValue) {
    try {
      const docRef = await addDoc(collection(db, "jobs"), {
        description: descriptionValue,
        position: positionValue
      })
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    alert('job add')
    main.innerHTML = ''
    main.appendChild(jobList)
  } else {
    window.alert('please enter job details')
  }
  }
}



function handleSwitchToMain() {
  main.innerHTML = ''
  main.appendChild(jobList)
}

function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCityAndState(lat, lng);
      },
      (error) => {
        console.error("Error getting user location:", error);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function getCityAndState(lat, lng) {
  const apiKey = 'fa6b77d5fe4b443baa8c6f72ac2bd77c'; // Replace with your API key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.results.length > 0) {
        const components = data.results[0].components;
        const city = components.city || components.town || components.village || '';
        const country = components.country || '';
        console.log(`City: ${city}, State: ${country}`);
        const data = {
          city: city,
          country: country
        }
        console.log(data, '>>>> city, country');
      } else {
        console.error('No results found');
      }
    })
    .catch(error => console.error('Error with fetch:', error));
}

