import Foundation

@objc public class ScannerManager: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
