export const TO_VALIDATE_METADATA_KEY: symbol = Symbol.for('to_validate');

/**
 * Decorator indicating that this property must not be null.
 * @constructor
 */
export function Validate(): PropertyDecorator {
	return (target: any, propertyKey: string): void => {
		// Retrieve properties to validate for this class.
		let to_validate: string[] = Reflect.getMetadata(TO_VALIDATE_METADATA_KEY, target);
		if (!to_validate) {
			to_validate = [];
		}
		// Add this property.
		if (!to_validate.some(key => key === propertyKey)) {
			to_validate.push(propertyKey);
		}
		// Save.
		Reflect.defineMetadata(TO_VALIDATE_METADATA_KEY, to_validate, target);
	};
}
