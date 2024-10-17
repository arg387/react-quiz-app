import { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Header from './components/Header';
import UserForm from './components/UserForm';
import Question from './components/Question';
import Results from './components/Results';
import { Toggle } from './components/Toggle';
import useLocalStorage from 'use-local-storage';





const questions = [
  {
    question: "What's your favorite color?",
    options: ["Red 🔴", "Blue 🔵", "Green 🟢", "Yellow 🟡"],
  },
  // Add more questions here
  {
    question: "What's your favorite animal?",
    options: ["Lion 🦁", "Tiger 🐯", "Elephant 🐘", "Giraffe 🦒"],
  },
  {
    question: "What's your favorite food?",
    options: ["Pizza 🍕", "Burger 🍔", "Sushi 🍣", "Tacos 🌮"],
  },
];

const keywords = {
  Fire: "sun",  
  Water: "water",
  Earth: "landscape",
  Air: "sky",
  Lion: "Fire",
  Tiger: "Fire",
  Elephant: "Earth",
  Giraffe: "Earth",
  Pizza: "Fire",
  Burger: "Fire",
  Sushi: "Water",
  Tacos: "Earth",

};

const elements = {
  "Red 🔴": "Fire",
  "Blue 🔵": "Water",
  "Green 🟢": "Earth",
  "Yellow 🟡": "Air",
  // Add more elements here
  "Lion 🦁": "Fire",
  "Tiger 🐯": "Fire",
  "Elephant 🐘": "Earth",
  "Giraffe 🦒": "Earth",
  "Pizza 🍕": "Fire",
  "Burger 🍔": "Fire",
  "Sushi 🍣": "Water",
  "Tacos 🌮": "Earth",
};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userName, setUserName] = useState('');
  const [element, setElement] = useState('');
  const [artwork, setArtwork] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const preferences = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDark, setIsDark] = useLocalStorage('isDark', preferences);
   /*To ensure that the theme is applied to the html element, which correctly updates all the global styles defined for [data-theme="dark"] useEffect is used here. */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);


  function handleAnswer(answer) {
    setAnswers([...answers, answer]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleUserFormSubmit(name) {
    setUserName(name);
    
  }

  function determineElement(answers) {
    const counts = {};
    answers.forEach((answer) => {
      const element = elements[answer];
      counts[element] = (counts[element] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
  }

  
  useEffect(() => {
    function fetchArtwork(keyword) {
      const apiEndpoint1 = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${keyword}`;
      
      fetch(apiEndpoint1)
        .then(response => response.json())
        .then(data => {
          if (data.total > 0) {
            const randomIndex = Math.floor(Math.random() * data.objectIDs.length); // Get a random index
            const objectId = data.objectIDs[randomIndex]; // Get a random object ID
            fetchArtworkDetails(objectId);
          }
        })
        .catch(error => {
          console.error('Error fetching artwork:', error);
        });
    }

    if (currentQuestionIndex === questions.length) {
      const selectedElement = determineElement(answers);
      setElement(selectedElement);
      fetchArtwork(keywords[selectedElement]);
    }
  }, [currentQuestionIndex, answers]);

  function fetchArtworkDetails(objectId) {
    const detailsEndpoint = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`;
    
    fetch(detailsEndpoint)
      .then(response => response.json())
      .then(data => {
        console.log('Artwork details:', data); // Debugging: Log the artwork details

        setArtwork({
          title: data.title,
          primaryImage: data.primaryImage && data.primaryImage !== '' ? data.primaryImage : 'https://picsum.photos/100',
          artistDisplayName: data.artistDisplayName || 'Unknown Artist',
          objectDate: data.objectDate || 'Unknown Date',
        });
        setDataLoaded(true);
      })
      
      .catch(error => {
        console.error('Error fetching artwork details:', error);
      });
  }
  useEffect(() => {
    if (dataLoaded) {
      console.log("Setting timeout...");
      const timeoutId = setTimeout(() => {
        console.log("Timeout executed!");
        try {
          window.location.href = "/";
        } catch (error) {
          console.error("Error replacing URL:", error);
        }
      }, 100000);// set a timeout of 1 min 40 sec
  
      return () => {
        console.log("Clearing timeout...");
        clearTimeout(timeoutId);
      };
    }
  }, [dataLoaded]);

 
  return (
    <>
      <div data-theme={isDark ? "dark" : "light"}>
        <Toggle handleChange={()=>setIsDark(!isDark)} isChecked={isDark} />
        <UserProvider value={{ name: userName, setName: setUserName }} >
            <Header />
            <Routes >
              <Route path="/" element={<UserForm onSubmit= {handleUserFormSubmit} />} />
              <Route
                path="/quiz"
                element={
                  currentQuestionIndex < questions.length ? (
                    <Question
                      question={questions[currentQuestionIndex].question}
                      options={questions[currentQuestionIndex].options}
                      onAnswer={handleAnswer}
                    />
                  ) : (
                    <Results element={element} artwork={artwork} />
                  )
                }
              />
            </Routes>
            
        </UserProvider>
        
      </div>
    </>

  );
  
}

export default App;