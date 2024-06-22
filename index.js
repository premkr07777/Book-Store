import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "eBooks",
    password: "Prem@456",
    port: 5433
});

db.connect();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", async (req, res) => {

    try {
        const resultAuthor = await db.query("SELECT * FROM authors ORDER BY id ASC");
        const author = resultAuthor.rows;
        
        const resultCategory = await db.query("SELECT * FROM categories ORDER BY id ASC");
        const category = resultCategory.rows;
        
        const resultRating = await db.query("SELECT * FROM ratings ORDER BY id ASC");
        const rating = resultRating.rows;
        
        const resultBooks = await db.query("SELECT * FROM books ORDER BY id ASC");
        const books = resultBooks.rows;
        
        const resultBestBooks = await db.query("SELECT * FROM books WHERE book_rating >= '4' ORDER BY id ASC");
        const bestBooks = resultBestBooks.rows;
    
        res.render("index.ejs", {
          listAuthor: author,
          listCategory: category,
          listRating: rating,
          resultBooks: books,
          resultBestBooks: bestBooks,
        });
      } catch (err) {
        console.log(err);
      }
});

app.get("/add-book", async (req, res) => {
  try{    
    const resultAuthor = await db.query("SELECT * FROM authors ORDER BY id ASC");
    const author = resultAuthor.rows;
    
    const resultCategory = await db.query("SELECT * FROM categories ORDER BY id ASC");
    const category = resultCategory.rows;
    
    const resultRating = await db.query("SELECT * FROM ratings ORDER BY id ASC");
    const rating = resultRating.rows;
    
    res.render("add-book.ejs", {
      listAuthor: author,
      listCategory: category,
      listRating: rating,
    });

  }catch(err){
    console.log(err);
  }
});

app.post("/add-book", async (req, res) => {
  const book_title = req.body.book_title;
  const book_intro = req.body.book_intro;
  const book_author = req.body.book_author;
  const book_category = req.body.book_category;
  const book_rating = req.body.book_rating;

  try{
    await db.query("INSERT INTO books (book_title, book_intro, book_author, book_category, book_rating) VALUES ($1, $2, $3, $4, $5)", [book_title, book_intro, book_author, book_category, book_rating]);
    
    res.redirect("/");
  }catch (err){
    console.log(err);
  }

});

app.get("/mystery", async (req, res) => {
  try{   
    
    const resultAuthor = await db.query("SELECT * FROM authors ORDER BY id ASC");
    const author = resultAuthor.rows;
    
    const resultCategory = await db.query("SELECT * FROM categories ORDER BY id ASC");
    const category = resultCategory.rows;
    
    const resultRating = await db.query("SELECT * FROM ratings ORDER BY id ASC");
    const rating = resultRating.rows;
    
    const resultBooks = await db.query("SELECT * FROM books ORDER BY id ASC");
    const books = resultBooks.rows;
    
    const resultBestBooks = await db.query("SELECT * FROM books WHERE book_category >= '4' ORDER BY id ASC");
    const bestBooks = resultBestBooks.rows;
    
    const resultCatBooks = await db.query("SELECT * FROM books WHERE book_category = 'Mystery' ORDER BY id ASC");
    const catBooks = resultCatBooks.rows;
    
    res.render("mystery.ejs", {
      listAuthor: author,
      listCategory: category,
      listRating: rating,
      resultBooks: books,
      resultBestBooks: bestBooks,
      resultCatBooks: catBooks,
    });

  }catch(err){
    console.log(err);
  }
})

app.listen(port, ()=>{
    console.log(`Server running on ${port} port.`);
})
