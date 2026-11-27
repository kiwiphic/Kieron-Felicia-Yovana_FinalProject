Kieron-Felicia-Yovana\_FinalProject

1. What is the creative motivation / intended use of your project.  
   (Why did you make it? Who do you envision using it? What do you want  
   the audience to experience?)  
     
   We wanted to turn a happy memory into something you can see. Usually a memory only exists as words, either in your head or written down. In Happy Memory Garden, each word you type grows into a plant, so a sentence becomes a small garden that grows while you write it. We liked the idea that a garden takes time to grow, the same way memories build up over time.  
     
   An important part of our idea is that the same sentence always grows the exact same garden. If you type the same memory again, even days later, you get the same image back. This ties the artwork to the memory: each happy memory has its own garden that belongs to it and can't be changed. Like a real memory, you can come back to it and find it just as you left it. Because it's always the same, the garden works like a picture of that moment that you can always go back to. Your words decide what the garden looks like, but you can't predict it exactly, so it still feels like something grew on its own.  
     
   We imagine anyone using it. That could be a student, a friend, or someone visiting an exhibition who wants a quiet, calm moment. You don't need to know anything about art or coding. You just type. We'd like the audience to slow down and think of a happy moment, then enjoy watching it grow word by word and sway in the wind. We hope people feel calm, a little nostalgic, and happy that their memory now has a garden they can come back to.  
    
     
2. Describe how you implemented the project.  
   (What generative techniques have you used, and why? What other  
   software tools or libraries did you use?)  
     
   We have mainly used Week 9’s lesson on Fractals and Recursion for our project. Our project feature recursive branches where each plant is drawn by a branch() function that draws one stem, and then moving to its tip and ‘calls’ itself twice to draw a smaller left and right branch. This repeats itself until the depth reaches 0, which is when a flower is drawn. This makes a fractal, where every branch looks like a smaller copy of the whole tree. For the flowers, each petal is drawn by a second recursive function, petal(). It works like a tiny tree that splits itself twice, with a dot at each tip. The petals are copied around the centre of the flower, so the flowers are fractals made up of tiny trees. Functions push() and pop() save a restores the position and rotation around every recursive call, so each branch starts from it’s parent’s tip without affecting the rest.  
     
   As we wanted the garden to be a memory, the same words/sentence will always grow the same plant. We used the textSeed() and randomSeed() functions, so that it generates the same artwork when the same sentence and words combinations are typed. We used noise() for the wind because it changes smoothly overtime and looks like a real breeze.   
     

3. How successful was your project in meeting your creative aims.  
   (What works well? What challenges did you face? What might you change  
   if you had more time?)

**What works well**  
Overall we think the project meets its main aim. When you type a word and see a plant grow from it, the link between your words and the artwork is clear, which was what we wanted most. Seeding the randomness with the text worked well too: the same sentence always gives the same garden, so it really does act like a memory. The starting prompt in the text box also shows new users what to do before they begin.

**What challenges did we face**  
One of our main challenges was keeping the garden simple and still understandable. We wanted a calm, clean image that doesn't overwhelm people, but if it was too simple, users couldn't tell how their words had shaped it. If we added too much detail, it got messy and the link between word and plant was lost again. We had to find a balance so that each plant is easy to read as "one word" while still being interesting to look at.

Another challenge was that our randomness wasn't seeded at first. Every time you typed the same sentence, you got a completely different garden. That made the link to a memory weak, because a memory should stay the same when you come back to it. Once we make the randomness seeded, the same sentence always grew the same garden. This made the memory idea much stronger.

**What we'd change with more time**

* Make each word's features (length, vowels and so on) show more strongly in the plant, so people can see why their word grew the plant it did


4. Credit any third-party resources (e.g. code, data) you used and state which  
   aspects of the project are your own work.  
    
* Text bar, resizing canvas  
  * https\://p5js.org/reference/  
  * https\://p5js.org/reference/p5/p5.Element/   
* Seed generation  
  * https\://p5js.org/reference/p5/randomSeed/


5. Provide instructions for compiling and running your project.   
     
* Open the index.html and [sketch.js](http://sketch.js) in VS code  
* Use the live server extension and copy the link  
* Paste the link into any browser to run the project

**How to use ‘Happy Memory Garden’**

* The garden starts with three plants as an example  
* Type a sentence in the text box at the bottom (prompt is given). Typing your first word clears the starter plants.  
* Each word grows into a plant once you type a space, comma, or full stop after it.

