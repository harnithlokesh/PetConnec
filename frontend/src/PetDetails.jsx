import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./PetDetails.css"; 

// Define pets data with backstories
const pets = [
  { id: 1, name: "Buddy", type: "Dog", image: "/dog1.jpg", description: "A playful and friendly dog.", story: "Buddy was once a beloved pet of an elderly man named Mr. Thompson. They spent every evening taking long walks together. Unfortunately, when Mr. Thompson fell ill and had to move to an assisted living facility, Buddy couldn't go with him. His owner's last wish was for Buddy to find a loving home where he could continue his evening strolls and bring joy to someone else's life." },
  { id: 2, name: "Whiskers", type: "Cat", image: "/cat1.jpg", description: "A curious and affectionate cat.", story: "Whiskers used to live in a cozy apartment with a college student named Emily. They were inseparable, but when Emily had to move abroad for studies, she couldn’t take Whiskers with her due to travel restrictions. Heartbroken, she left him in the care of a shelter, hoping he would find another warm lap to curl up in." },
  { id: 3, name: "Charlie", type: "Rabbit", image: "/rabbit1.jpg", description: "A cute and fluffy rabbit.", story: "Charlie was a gift to a young girl on her 10th birthday. They shared endless moments of laughter, but when her family had to relocate due to her father's job, their new home didn't allow pets. With tears in her eyes, she entrusted Charlie to a shelter, hoping he'd find another child to love and play with." },
  { id: 4, name: "Luna", type: "Dog", image: "/dog2.jpg", description: "A loyal and energetic pup.", story: "Luna belonged to a soldier who was deployed overseas. She was trained to wait patiently by the door every evening, expecting his return. When he couldn’t come back, Luna was left in the care of a rescue center. Despite her sadness, she remains hopeful that she will find another human to protect and love." },
  { id: 5, name: "Mittens", type: "Cat", image: "/cat2.jpg", description: "A cat with a playful personality.", story: "Mittens lived in a bookstore, napping between stacks of books and charming every customer. When the bookstore closed down due to financial difficulties, Mittens lost her home. She now longs for a place where she can curl up with someone and listen to bedtime stories again." },
  { id: 6, name: "Daisy", type: "Rabbit", image: "/rabbit2.jpg", description: "Loves to hop around and explore.", story: "Daisy was raised on a small farm, but after a flood forced the family to relocate, they had to give up most of their animals, including Daisy. She still has the spirit of adventure and dreams of finding a new home where she can hop freely and explore new places." },
  { id: 7, name: "Rocky", type: "Dog", image: "/dog3.jpg", description: "A brave and protective companion.", story: "Rocky was once part of a rescue team, helping find lost hikers in the mountains. When he grew older, he was retired from duty, and now he is looking for a home where he can enjoy his golden years with a loving family." },
  { id: 8, name: "Snowball", type: "Cat", image: "/cat3.jpg", description: "A fluffy cat who loves to snuggle.", story: "Snowball was found as a stray kitten during a snowstorm, shivering and alone. A kind-hearted rescuer took her in and nursed her back to health, but due to their allergies, they couldn’t keep her. She now waits for a forever home where she can stay warm and safe forever." },
  { id: 9, name: "Coco", type: "Rabbit", image: "/rabbit3.jpg", description: "Loves carrots and cuddles.", story: "Coco was once part of a petting zoo, adored by children. When the petting zoo shut down, many animals were rehomed, but Coco has yet to find a family to call her own." },
  { id: 10, name: "Rex", type: "Dog", image: "/dog4.jpg", description: "A strong and loyal guardian.", story: "Rex was a guard dog at a factory, but when the factory shut down, he was left behind. Despite his past job, he has a soft heart and just wants a family to love and protect." },
  { id: 11, name: "Shadow", type: "Cat", image: "/cat4.jpg", description: "A mysterious but affectionate feline.", story: "Shadow wandered into a library one day and made it his home, silently observing readers as they turned pages. When the library had to undergo renovations, Shadow had to find a new place to call home." },
  { id: 12, name: "Pumpkin", type: "Rabbit", image: "/rabbit4.jpg", description: "Energetic and playful.", story: "Pumpkin was found hopping around in a pumpkin patch, blending in so well that it took the farmer days to realize he was there. Now, he’s looking for a family who will let him bounce around to his heart’s content." }
];

// Component
const PetDetails = () => {
  const { id } = useParams(); // Get pet ID from URL
  const navigate = useNavigate();

  const pet = pets.find((p) => p.id === parseInt(id)); // Find pet by ID

  if (!pet) {
    return <h2>Pet not found!</h2>; // Handle invalid pet ID
  }

  return (
    <div className="pet-details-page">
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
      <div className="pet-details-container">
        <img src={pet.image} alt={pet.name} className="pet-image" />
        <h2>{pet.name}</h2>
        <p><strong>Type:</strong> {pet.type}</p>
        <p>{pet.description}</p>
        <hr />
        <h3>🐾 {pet.name}'s Story</h3>
        <p className="pet-story">{pet.story}</p>
      </div>
    </div>
  );
};

export default PetDetails;
