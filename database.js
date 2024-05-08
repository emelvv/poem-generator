const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('userdata.db', sqlite3.OPEN_READWRITE, (err)=>{
    if (err) console.error(err);
});

// Create users table
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
});

// Function to add user to the database
function addUser(username, password) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", username, (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        resolve(false);
      } else {
        db.run("INSERT INTO users (username, password) VALUES (?, ?)", username, password, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(true);
          }
        });
      }
    });
  });
}


function getTable(){
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users", (err, row) => {
            if (err){
                reject(err)
            }else{
                resolve(row)
            }
        })
    })
}

// Function to check user in the database
function checkUser(username, password) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ? AND password = ?", username, password, (err, row) => {
        if (err) {
            reject(err);
        }else if (row){
            resolve(true)
        }else{
            resolve(false)
        }
        
    });
  });
}

// // Example usage
// db.serialize(async () => {
//     console.log(await checkUser('admin', 'admin1'));
// });


module.exports = {addUser, checkUser};