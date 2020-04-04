import * as React from 'react';
import Axios from 'axios';

const PartyCreation: React.FunctionComponent = () => (
  <form
    onSubmit={() =>
      Axios.post('http://localhost:6011/parties', {
        name: 'Here should be the partyname',
      })
    }
  >
    <p>Party name: </p>
    <input id="partyName" name="partyName" type="text" />
    <button type="submit">Create Party</button>
  </form>
);

export default PartyCreation;
