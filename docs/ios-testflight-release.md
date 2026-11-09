# iOS TestFlight Release Setup

The TestFlight workflow runs only when manually started from the `ios_pub` branch. It uses GitHub's `app-store` environment so release credentials can be protected with required reviewers.

## GitHub environment

In the repository, open **Settings > Environments** and create `app-store`. Add a required reviewer before adding its secrets.

Add these environment secrets:

| Secret | Value |
| --- | --- |
| `IOS_DISTRIBUTION_CERTIFICATE_BASE64` | Base64-encoded App Store distribution `.p12` certificate. |
| `IOS_DISTRIBUTION_CERTIFICATE_PASSWORD` | Password set when exporting the `.p12` certificate. |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64-encoded App Store provisioning profile for `io.saws.aviation`. |
| `APP_STORE_CONNECT_KEY_ID` | App Store Connect API key ID. |
| `APP_STORE_CONNECT_ISSUER_ID` | App Store Connect API issuer ID. |
| `APP_STORE_CONNECT_PRIVATE_KEY_BASE64` | Base64-encoded contents of the API key `.p8` file. |

The Apple certificate and provisioning profile must belong to Developer Team `QN459DSJYF` and be valid for the bundle ID `io.saws.aviation`.

## Preparing the encoded secrets

Run these commands locally. Enter the resulting text as the matching GitHub environment secret; do not commit the generated files or output.

```sh
base64 -i distribution.p12 -o distribution.p12.base64
base64 -i AppStore.mobileprovision -o AppStore.mobileprovision.base64
base64 -i AuthKey_ABC123DEFG.p8 -o AuthKey_ABC123DEFG.p8.base64
```

## Releasing a build

1. Push the intended source to `ios_pub` and confirm the **iOS CI** workflow passes.
2. Open **Actions > iOS TestFlight Release > Run workflow** and select `ios_pub`.
3. Enter the App Store version and TestFlight changelog, then start the run.
4. Approve the `app-store` environment deployment when GitHub requests it.
5. After App Store Connect processes the upload, test the build through TestFlight and select it for App Review in App Store Connect.

The workflow uses the GitHub Actions run number as the iOS build number, which guarantees a new value for every upload.