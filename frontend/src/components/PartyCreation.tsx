import * as React from 'react';
import Axios from 'axios';

const PartyCreation: React.FunctionComponent = () => {
  const [partyName, setPartyName] = React.useState('');
  return (
    <form
      onSubmit={() =>
        Axios.post('http://localhost:6011/parties', {
          name: partyName,
        })
      }
    >
      <p>Party name: </p>
      <input id="partyName" name="partyName" type="text" onChange={(e) => setPartyName(e.target.value)} />
      <button type="submit">Create Party</button>
    </form>
  );
};
export default PartyCreation;
