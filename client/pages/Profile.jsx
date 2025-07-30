const [user, setUser] = useState({});
const [form, setForm] = useState({ username: '', email: '' });

useEffect(() => {
  const fetchProfile = async () => {
    const res = await axios.get('/api/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(res.data);
    setForm({ username: res.data.username, email: res.data.email });
  };
  fetchProfile();
}, []);

const handleUpdate = async () => {
  const res = await axios.put('/api/user/me', form, {
    headers: { Authorization: `Bearer ${token}` },
  });
  alert('Profile updated!');
};
