import ImageUpload from './ImageUpload'
import ImagePreview from './ImagePreview'
import { useState } from 'react'
import { enhancedImageAPI } from '../utils/enhancedImageApi'

const Home = () => {

  const [uploadImage, setUploadImage] = useState(null)
  const [enhancedImage, setEnhancedImage] = useState(null)
  const [loading, setloading] = useState(false)

  const uploadImageHandler = async (file) => {
    setUploadImage(URL.createObjectURL(file))
    setloading(true)
    // call the api to enhance the image
    try {

      const enhancedURL = await enhancedImageAPI(file);
      setEnhancedImage(enhancedURL);
      setloading(false)

    } catch (error){
      console.log(error)
      alert('Error while enhancing the image')
    }
  }

  return (
        <>
    <ImageUpload uploadImageHandler={uploadImageHandler}/>
    <ImagePreview loading={loading} 
                  uploaded={uploadImage}
                  enhanced={enhancedImage?.image}
                  />
    </>
)
}

export default Home