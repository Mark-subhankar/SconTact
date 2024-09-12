import Spinner from 'react-bootstrap/Spinner';

const Sppiner = ({ splash = "Loading..." }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '50vh' }}>
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">{splash}</span>
      </Spinner>
      <h6 style={{ margin: '10px 0 0 0' }}>{splash}</h6>
    </div>
  );
}

export default Sppiner;
