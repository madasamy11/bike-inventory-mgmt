# Branch Protection Setup

This repository has branch protection configured to ensure code quality and proper review process.

## CODEOWNERS

The `.github/CODEOWNERS` file defines code ownership for the repository. All files are owned by the repository owner (@madasamy11), which means:

- All pull requests require approval from @madasamy11 before merging
- This ensures proper review and oversight of all changes to the codebase

## Additional Branch Protection (Manual Setup Required)

While the CODEOWNERS file enables automatic review requests, additional branch protection rules should be configured in GitHub repository settings for complete protection:

### Recommended Settings for `main` branch:

1. **Navigate to**: Repository Settings → Branches → Add branch protection rule
2. **Branch name pattern**: `main`
3. **Enable the following rules**:
   - ✅ Require a pull request before merging
     - ✅ Require approvals (minimum: 1)
     - ✅ Require review from Code Owners
   - ✅ Do not allow bypassing the above settings
   - ✅ Restrict who can push to matching branches (optional: only allow specific teams/users)

### Benefits

- **Code Quality**: All changes are reviewed before merging
- **Accountability**: Clear ownership and review trail
- **Protection**: Prevents accidental direct commits to main branch
- **Collaboration**: Encourages proper PR workflow

## How It Works

1. Developer creates a feature branch and makes changes
2. Developer opens a pull request to merge into `main`
3. GitHub automatically requests review from @madasamy11 (based on CODEOWNERS)
4. PR cannot be merged until @madasamy11 approves
5. After approval, the PR can be merged

## Notes

- The CODEOWNERS file alone enforces review requests but requires the repository settings to enforce the requirement
- Repository administrators can still bypass these rules unless "Do not allow bypassing" is enabled
- For full enforcement, ensure branch protection rules are configured in repository settings as described above
