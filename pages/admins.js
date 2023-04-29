import { Layout } from "@/components";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { HashLoader } from "react-spinners";

export default function AdminsPage() {
    const [email, setEmail] = useState('');
    const [adminEmails, setAdminEmails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [deletedAdmin, setDeletedAdmin] = useState();
    const [err, setErr] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');

    const addAdmit = (e) => {
        e.preventDefault();
        axios.post('/api/admins', { email }).then(response => {
            toast.success('Admin added successfully!');          
            setEmail('');
            loadAdmins();
        }).catch(err => {
            setErr(err.response.data.message);
            toast.error(err.response.data.message)
        });
    }

    const loadAdmins = () => {
        setIsLoading(true);
        axios.get('/api/admins').then(response => {
            setAdminEmails(response.data);
            setIsLoading(false);
        });
    }

    useEffect(() => {
        loadAdmins();
    }, []);

    const deleteAdmin = (_id) => {
        setIsDelete(false);
        axios.delete('/api/admins?_id='+ _id).then(() => {
            toast.success('Admin deleted successfully!');
            loadAdmins();
        });
    };

    return (
        <Layout>
            {
                 isDelete &&
                 (
                     <div className='fixed top-0 right-0 w-screen h-screen bg-black bg-opacity-20 backdrop-filter-3
                      backdrop-blur-sm z-50 transition duration-100 ease-in-out flex justify-center'>
                         <div className='delete top-60 rounded-lg'>
                             <h1 className='text-center'>
                                 Do you really want to delete "{deletedAdmin.email} "?
                             </h1>
                             <div className='flex gap-2 justify-center'>
                                 <button className='btn-red'
                                     onClick={() => deleteAdmin(deletedAdmin._id)}
                                 >Yes</button>
                                 <button className='btn-default'
                                     onClick={() => setIsDelete(false)}
                                 >No</button>
                             </div>
                         </div>
                     </div>
                 )
            }
            <h1>Admins</h1>
            <h2>Add New Admins</h2>
            <form onSubmit={addAdmit}>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="mb-0"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="google email" />
                    <button
                        type="submit"
                        className="btn-primary py-1 whitespace-nowrap">Save</button>
                </div>
                <div className="text-red-900">{err}</div>
            </form>

            <h2>Existing Admins</h2>
            <table className="basic">
                <thead>
                    <tr>
                        <td>Google Email</td>
                        <td>Edit</td>
                    </tr>
                </thead>
                <tbody>
                    {!isLoading && adminEmails.length > 0 && adminEmails.map(adminEmail => (
                        <tr key={adminEmail._id} className="text-left">
                            <td>{adminEmail.email}</td>
                            <td>
                                <button
                                    onClick={() => {
                                        setDeletedAdmin(adminEmail);
                                        setIsDelete(true);
                                    }}
                                    className='bg-red-800 text-white text-sm p-1 px-2 rounded-md inline-flex gap-1 mr-1 items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                isLoading ?
                    <div className='h-screen flex items-center justify-center ' >
                        <HashLoader color='#1E3A8A' speedMultiplier={2} size={150} />
                    </div>
                    :
                    ''
            }
        </Layout>
    );
}