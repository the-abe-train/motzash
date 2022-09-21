# Testing Havdalah time function

## Requirements
1. Functions that push havdalah to database send the right info
   1. useHavdalah
2. Functions that pull rows with havdalah from db get the right info
   1. loadPolls
   2. loadVotes
   3. loadMyStatus
   4. loadStatuses
3. Tasks are reset to `is_complete = false` and updated with new havdalah value

## Tests
1. Pull data, and make sure the havdalah in the data isn't too late
2. Push data with later havdalah, then try to pull it and make sure it doesn't come
3. Make sure there are no widgets with havdalah's after the next one
4. Make sure that widgets with old havdalah's cannot be pulled



## Simplest possible tests
1. Make sure all data pulled have the right havdalah
2. Make sure all data pushed has right havdalaha

## Harder test
1. Change time to next week and do simple tests again


# Details

## Havdalah data that gets uploaded
1. When tasks, votes, and statuses are inserted/updated in the db, they are sent with a havdalah property
2. The havdalah property is the Rata Die of the next havdalah, as determined by hebcal.
3. 

