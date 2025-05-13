import { useParams } from "react-router-dom";

const CallCenter: React.FC = () => {
    const { id } = useParams<{ id: string }>();
//to do : לשנות ולהתאים את זה
    return (
        <div>
            <h2>ID: {id}</h2>
        </div>
    );
};

export default CallCenter;
