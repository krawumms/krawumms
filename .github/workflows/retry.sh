#!/bin/bash

echo "Trying $*" 
bash -c "$*"

RC="$?"

if [[ "$RC" != "0" ]]; then
  echo "Got RC $RC, retrying now..."

  bash -c "$*"

  RC="$?"
fi

echo "Done with RC $RC"

exit $RC
