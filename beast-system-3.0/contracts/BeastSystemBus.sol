// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICredentialRegistry {
    function holderCredentials(address holder) external view returns (uint256[] memory);
    function credentials(uint256 credentialId) external view returns (
        uint256 id, address holder, address issuer, string memory cType, string memory meta, bool revoked
    );
}

interface ILegalArbitration {
    function certifiedArbitrators(address arbitrator) external view returns (bool);
}

contract BeastSystemBus {
    address public owner;
    address public credentialRegistryAddress;
    address public arbitrationAddress;

    event ModuleAddressesUpdated(address indexed credentialRegistry, address indexed arbitration);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only system owner can execute");
        _;
    }

    constructor(address _credentialRegistry, address _arbitration) {
        owner = msg.sender;
        credentialRegistryAddress = _credentialRegistry;
        arbitrationAddress = _arbitration;
    }

    function setModuleAddresses(address _credentialRegistry, address _arbitration) external onlyOwner {
        credentialRegistryAddress = _credentialRegistry;
        arbitrationAddress = _arbitration;
        emit ModuleAddressesUpdated(_credentialRegistry, _arbitration);
    }

    /**
     * @notice Verifies whether a wallet holds an active, non-revoked credential of a specific type.
     */
    function verifyActiveCredential(address _user, string calldata _requiredType) public view returns (bool) {
        if (credentialRegistryAddress == address(0)) return false;

        ICredentialRegistry registry = ICredentialRegistry(credentialRegistryAddress);
        uint256[] memory userCreds = registry.holderCredentials(_user);

        for (uint256 i = 0; i < userCreds.length; i++) {
            (,, , string memory cType,, bool revoked) = registry.credentials(userCreds[i]);
            if (!revoked && keccak256(bytes(cType)) == keccak256(bytes(_requiredType))) {
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Checks whether an address is qualified to serve as a legal arbitrator in the BEAST ecosystem.
     */
    function validateArbitratorEligibility(address _arbitrator) external view returns (bool) {
        // Must be explicitly certified in the Legal Arbitration module AND hold an active "Legal Arbitrator" credential
        ILegalArbitration arbitration = ILegalArbitration(arbitrationAddress);
        bool isCertified = arbitration.certifiedArbitrators(_arbitrator);
        bool hasCredential = verifyActiveCredential(_arbitrator, "Legal Arbitrator");

        return isCertified && hasCredential;
    }
}
