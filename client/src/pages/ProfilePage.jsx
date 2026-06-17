import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

  const {authUser,updateProfile}=useContext(AuthContext)


  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedImage){
      await updateProfile({fullName:name,bio});
      navigate('/')
      return;
    }

    const reader=new FileReader()
    reader.readAsDataURL(selectedImage);

    reader.onload=async()=>{
      const base64Image =reader.result;
      console.log(base64Image);
      await updateProfile({profilePic:base64Image,fullName:name,bio});
      navigate('/');
    }
  };



  return (
    <div className='min-h-screen flex items-center justify-center bg-no-repeat bg-cover'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex
      items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='p-10 flex flex-col gap-6 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => setSelectedImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden/>
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImage && 'rounded-full'}`}/>
            upload profile image
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" required placeholder="Name" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} placeholder='Short Bio' required rows={4}
          className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
          <button type="submit" className='bg-gradient-to-r from-purple-400 to-violet-600 hover:bg-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>
            Save Changes
          </button>
        </form>
        <img className={`max-w-44 aspect-square rounded-full 
        max-sm:mt-10 ${selectedImage && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>
    </div>
  )
}

export default ProfilePage