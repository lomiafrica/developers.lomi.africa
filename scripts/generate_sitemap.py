import os
from datetime import datetime
from urllib.parse import urljoin
import xml.etree.ElementTree as ET
import logging
from typing import Dict, List

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SitemapGenerator:
    def __init__(self) -> None:
        self.base_url = "https://www.developers.lomi.africa"
        self.src_dir = "src"  # Directory containing React/TS files
        self.output_dir = "public"
        
        # Priority and change frequency mappings
        self.route_config: Dict[str, Dict] = {
            "": {  # Homepage
                "priority": "1.0",
                "changefreq": "daily"
            },
            "pricing": {
                "priority": "0.9",
                "changefreq": "weekly"
            },
            "docs": {
                "priority": "0.8",
                "changefreq": "weekly"
            },
            "blog": {
                "priority": "0.7",
                "changefreq": "daily"
            },
            "default": {
                "priority": "0.5",
                "changefreq": "monthly"
            }
        }

    def get_route_paths(self) -> List[str]:
        """Extract routes from React/TS files."""
        routes = []
        
        for root, _, files in os.walk(self.src_dir):
            for file in files:
                if file.endswith(('.tsx', '.ts')):
                    file_path = os.path.join(root, file)
                    # Remove src directory and file extension
                    route = os.path.splitext(os.path.relpath(file_path, self.src_dir))[0]
                    
                    # Convert path separators to URL format
                    route = route.replace(os.path.sep, '/')
                    
                    # Skip certain files/directories
                    if not any(skip in route for skip in ['components/', 'utils/', 'types/', 'hooks/']):
                        # Handle index files
                        if route.endswith('/index'):
                            route = route[:-6]  # Remove '/index'
                        routes.append(route)
        
        return sorted(routes)

    def get_route_config(self, route: str) -> Dict:
        """Get priority and change frequency for a route."""
        for key, config in self.route_config.items():
            if route.startswith(key):
                return config
        return self.route_config["default"]

    def generate_sitemap(self) -> None:
        """Generate the sitemap XML file."""
        try:
            # Create urlset element with namespace
            urlset = ET.Element("urlset")
            urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

            # Get all routes
            routes = self.get_route_paths()
            logger.info(f"Found {len(routes)} routes")

            # Add each route to sitemap
            for route in routes:
                url = ET.SubElement(urlset, "url")
                
                # Location
                loc = ET.SubElement(url, "loc")
                full_url = urljoin(self.base_url, route)
                loc.text = full_url

                # Last modified
                lastmod = ET.SubElement(url, "lastmod")
                lastmod.text = datetime.now().strftime("%Y-%m-%d")

                # Get route configuration
                config = self.get_route_config(route)
                
                # Change frequency
                changefreq = ET.SubElement(url, "changefreq")
                changefreq.text = config["changefreq"]
                
                # Priority
                priority = ET.SubElement(url, "priority")
                priority.text = config["priority"]

            # Create output directory if it doesn't exist
            os.makedirs(self.output_dir, exist_ok=True)

            # Write the sitemap file
            output_path = os.path.join(self.output_dir, "sitemap.xml")
            tree = ET.ElementTree(urlset)
            tree.write(
                output_path,
                encoding="UTF-8",
                xml_declaration=True,
                method="xml"
            )
            
            logger.info(f"Sitemap generated successfully at {output_path}")

        except Exception as e:
            logger.error(f"Error generating sitemap: {str(e)}")
            raise

if __name__ == "__main__":
    generator = SitemapGenerator()
    generator.generate_sitemap()