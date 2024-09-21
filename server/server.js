import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:'nodeprojet'
})

app.get('/', (req, res) => {
    const sql = "SELECT numProduit, design, prix, quantite, quantite*prix as montant FROM produits";
    db.query(sql, (err, result)=> {
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.get('/getproduit/:numProduit', (req, res) => {
    const sql = "SELECT numProduit, design, prix, quantite FROM produits WHERE numProduit = ?";
    db.query(sql, (err, result)=> {
        if(err) return res.json({Message: "Error inside server"});
        return res.json(result);
    })
})

app.delete('/deleteproduit/:numProduit', (req, res) => {
    const { numProduit } = req.params;
    const sql = "DELETE FROM produits WHERE numProduit = ?";
    db.query(sql,[numProduit], (err, result)=> {
        if(err) return res.json({Message: "Error inside server"});
        return res.json({message: "Produit supprimé avec succès"});
    });
});

app.post('/ajoutproduit', (req, res)=> {
    const sql = "INSERT INTO produits (`design`, `prix`, `quantite`) VALUES (?)";
    console.log(req.body)
    const vals = [
        req.body.design,
        req.body.prix,
        req.body.quantite
    ]
    db.query(sql, [vals], (err ,result) => {
        if(err) return res.json(err);
        return res.json(result);
    })
})

app.put('/updateproduit/:numProduit', (req, res) => {
    const { numProduit } = req.params; 
    const { design, prix, quantite } = req.body; 

    const sql = "UPDATE produits SET design = ?, prix = ?, quantite = ? WHERE numProduit = ?";

    db.query(sql, [design, prix, quantite, numProduit], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour du produit : ", err);
            res.status(500).send("Une erreur est survenue lors de la mise à jour du produit.");
        } else {
            console.log("Produit mis à jour avec succès.");
            res.status(200).send({ message: "Produit mis à jour avec succès.", numProduit, design, prix, quantite });
        }
    });
});



app.listen(8081, ()=> {
    console.log("Miandry");
})