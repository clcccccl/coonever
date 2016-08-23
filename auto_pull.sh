#! /bin/bash
while true
do
    echo update ${PWD}
    git pull origin origin
    sleep 5
done
