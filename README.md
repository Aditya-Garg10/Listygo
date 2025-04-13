
### How It Works

1. The component initializes its internal state (preferences) from the DB (via the user prop).  
2. Controlled checkboxes are used so their checked state reflects the current preference values.  
3. The handleToggle function updates local state and calls updateDetails (which should send a PUT request to your update route) to persist the change in the backend.

