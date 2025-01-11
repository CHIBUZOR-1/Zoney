import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../Context/AppContext';

const GroupChatContainer = () => {
    const { socket, setMessagez, messagez } = useAuth(); 
    const user = useSelector(state => state?.user?.user); 
    const [openUploads, setOpenUploads] = useState(false); 
    const [allMessages, setAllMessages] = useState([]); 
    const [messages, setMessages] = useState({ 
        text: "", 
        image: "", 
        video: "", 
        voiceClip: "" 
    });
    const [groupDetails, setGroupDetails] = useState({ 
        _id: "", 
        name: "", 
        members: [], 
        unseenMsg: 0, 
        lastMsg: {} 
    });
    const emojiRef = useRef(null); 
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    useEffect(() => { 
        function clickOutside(event) { 
            if (emojiRef.current && !emojiRef.current.contains(event.target)) { 
                setShowEmojiPicker(false); 
            } 
        } 
        document.addEventListener('mousedown', clickOutside); 
        return () => { 
            document.removeEventListener('mousedown', clickOutside); 
        }; 
    }, [emojiRef]);
    const [showRecording, setShowRecording] = useState(false); 
    const lastMessage = useRef(); 
    useEffect(() => { 
        if (lastMessage.current) { 
            lastMessage.current.scrollIntoView({ behaviour: 'smooth', block: 'end' }); 
        } 
    }, [allMessages]);
    useEffect(() => { 
        if (lastMessage.current) { 
            lastMessage.current.scrollIntoView({ behaviour: 'smooth', block: 'end' }); 
        } 
    }, []);
    useEffect(() => { 
        if (socket) { 
            socket.emit('fetchGroupDetails', params.groupId); 
            socket.emit('fetchGroupDialogues', params.groupId);
            socket.emit("markGroupMessageAsSeen", { groupId: params.groupId, userId: user?.id }); 
            socket.on('groupMessage', (data) => { 
                console.log("groupMessage", data); 
                setAllMessages(data); 
                setMessagez(data); }); 
                socket.on('groupDetails', (data) => { 
                    console.log('groupDetails', data); 
                    setGroupDetails(data); 
                }); 
        } 
    }, [socket, params?.groupId, user, allMessages.length]);
    const handleUploads = () => { 
        setOpenUploads(prev => !prev); 
    }; 
    const uploadImg = (e) => { 
        const file = e.target.files[0]; 
        setMessages(prev => ({ ...prev, image: file })); 
        setOpenUploads(false); 
    };
    const clearImg = () => { 
        setMessages(prev => ({ ...prev, image: "" })); 
    }; 
    const uploadVids = (e) => { 
        const file = e.target.files[0]; 
        setMessages(prev => ({ ...prev, video: file })); 
        setOpenUploads(false); 
    };
    const clearVid = () => { 
        setMessages(prev => ({ ...prev, video: "" })); 
    }; 
    const handleFileUpload = async (file, type) => { 
        const formData = new FormData(); 
        formData.append('file', file); 
        try { 
            const response = await axios.post('/upload', formData, { 
                headers: { 'Content-Type': 'multipart/form-data' } 
            }); 
            return response.data.filePath; 
        } catch (error) { 
            console.error('Error uploading file:', error); 
            return null; 
        }
    }
    const handleEmojiClick = (emojiObj) => { 
        setMessages(prev => ({ ...prev, text: prev.text + emojiObj.emoji })); 
    };
    const handleSend = async (e) => {
        e.preventDefault(); 
        let imageUrl = "", 
        videoUrl = "", 
        voiceUrl = ""; 
        if (messages.image) { 
            imageUrl = await handleFileUpload(messages.image, 'image'); 
        } 
        if (messages.video) { 
            videoUrl = await handleFileUpload(messages.video, 'video'); 
        }
        if (messages.voiceClip) { 
            voiceUrl = await handleFileUpload(messages.voiceClip, 'voiceClip'); 
        } 
        if (messages.text || imageUrl || videoUrl || voiceUrl) { 
            if (socket) { 
                socket.emit('groupMessage', { 
                    groupId: params?.groupId, 
                    sender: user?.id, 
                    text: messages.text, 
                    imageUrl, 
                    videoUrl, 
                    voiceUrl 
                }); 
                setMessages({ 
                    text: "", 
                    image: "", 
                    video: "", 
                    voiceClip: "" 
                }); 
            } 
        }
    }
    const handleStopRecording = useCallback((audioBlob) => { 
        setMessages(m => ({ ...m, voiceClip: audioBlob })); 
    }, []);
  return (
    <div>GroupChatContainer</div>
  )
}

export default GroupChatContainer