import React, { useState } from "react";
import { storage, fs } from './config/firebase'
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { Link } from "react-router-dom";

export const AddProducts = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [qty, setQty] = useState('');
    const [image, setImage] = useState(null);

    const [imageError, setImageError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [uploadError, setUploadError] = useState('');

    const productsCollectionRef = collection(fs, 'tblProducts');
    const types = ['image/jpg', 'image/jpeg', 'image/png', 'image/PNG'];

    const handleProductsImg = (e) => {
        let selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile && types.includes(selectedFile.type)) {
                setImage(selectedFile);
                setImageError('');
            } else {
                setImage(null);
                setImageError('Please select a valid file Type! (png or jpeg)')
            }
        } else {
            console.log('Please put a Image here');
        }
    }

    const handleAddProducts = (e) => {
        e.preventDefault();
        if (image != null) {
            const imgRef = ref(storage, `tblProducts/${image.name}`);
            uploadBytes(imgRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    addDoc(productsCollectionRef, {
                        prodTitle: title,
                        prodDesc: description,
                        prodPrice: Number(price),
                        prodQty: Number(qty),
                        prodURL: url,
                        timeStamp: serverTimestamp()
                    }).then(() => {
                        setSuccessMsg('Product Added Successfully');
                        setTitle('');
                        setDescription('');
                        setPrice('');
                        setQty('');
                        document.getElementById('file').value = '';
                        setImageError('');
                        setUploadError('');
                        setTimeout(() => {
                            setSuccessMsg('');
                        }, 3000)
                    }).catch(error => setUploadError(error.message));
                })
            })
        }
    }


    return (
        <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h1 className="text-center">Add Products</h1>
                <hr />
                {successMsg && (
                  <div className="success-msg">{successMsg}</div>
                )}
            <form autoComplete="off" className="form-group" onSubmit={handleAddProducts}>
                <label>Product Title</label>
                <input type="text" className="form-control" required
                    onChange={(e) => setTitle(e.target.value)} value={title}></input>
                <br></br>
                <label>Product Description</label>
                <input type="text" className="form-control" required
                    onChange={(e) => setDescription(e.target.value)} value={description}></input>
                <br></br>
                <label>Product Price</label>
                <input type="number" className="form-control" required
                    onChange={(e) => setPrice(e.target.value)} value={price}></input>
                <br></br>
                <label>Product Qty</label>
                <input type="number" className="form-control" required
                    onChange={(e) => setQty(e.target.value)} value={qty}></input>
                <br></br>
                <label>Upload Product Image</label>
                <input type="file" id="file" className="form-control" required
                    onChange={handleProductsImg} ></input>
                {imageError && <>
                    <br></br>
                    <div className="error-msg">{imageError}</div>
                </>}
                <br></br>

                <div style={{ display: "flex", justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-success btn-md">
                        SUBMIT
                    </button>
                    <a className="btn btn-primary btn-xl text-uppercase">
                            <Link to="/home" className="nav-link">
                                BACK
                            </Link>
                        </a>
                </div>
                
            </form>
            {uploadError && (
            <div className="error-msg">{uploadError}</div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>
    )
}

export default AddProducts;