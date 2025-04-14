import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import CreateClassModal from '../../components/teacher/CreateClassModal';

export default function CreateClassPage() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    // Go back to classes overview or wherever you want
    navigate('/classes');
  };

  const handleClassCreated = (newClass) => {
    setOpen(false);
    // Go to the new class page if you want:
    navigate(`/classes/${newClass.id}`);
  };

  return (
    <div>
      <Navbar />
      {open && (
        <CreateClassModal 
          onClose={handleClose}
          onClassCreated={handleClassCreated}
        />
      )}
    </div>
  );
}
