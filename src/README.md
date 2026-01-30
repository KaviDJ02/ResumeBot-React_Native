# src folder

This folder holds application source code.

Suggested structure:

- src/components/    # shared UI components
- src/screens/       # screen components grouped by area
  - Auth/            # SignIn, SignUp, Welcome
  - Main/            # Home, Resume, Profile
- src/navigation/    # app navigation setup
- src/assets/        # images, icons, fonts

Next steps:
- Move existing files from `components/` into `src/components` or `src/screens` as appropriate.
- Implement `src/navigation/index.tsx` to centralize navigation logic.
